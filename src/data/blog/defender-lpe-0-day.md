---
title: "BlueHammer: When Defender Becomes the Attack Surface"
description: "A zero-day in Windows Defender's update mechanism turns the antivirus into a privilege escalation primitive — no patch, public PoC, and a kill chain built entirely from native Windows APIs."
author: David Kasabji
pubDatetime: 2026-04-07T09:00:00Z
category: "Intrusion Log"
---

## TL;DR

- A researcher published a working LPE zero-day (no CVE, no patch) targeting Windows Defender's signature update mechanism on Windows 11 25H2.
- The kill chain chains a TOCTOU race condition with NTFS junctions, batch oplocks, and the Cloud Files API — all native Windows primitives — to force Defender to read the SAM hive as SYSTEM.
- The exploit ends with a full local credential dump and a SYSTEM shell via pass-the-hash.
- Reimplementations appeared on GitHub within 72 hours of disclosure. Detection is your only lever right now.

---

## What Happened

On April 3rd, a security researcher operating under the alias **Chaotic Eclipse** [published a fully functional proof-of-concept](https://github.com/Nightmare-Eclipse/BlueHammer) for a local privilege escalation vulnerability in Windows. The target: the signature update mechanism in **Windows Defender**. The motivation: frustration with Microsoft's Security Response Center.

"I was not bluffing Microsoft, and I'm doing it again," the researcher wrote, alongside a PGP-signed README and roughly 3,400 lines of C/C++ source code. No CVE has been assigned. No patch exists. Will Dormann, principal vulnerability analyst at Tharros, confirmed to BleepingComputer that the exploit works.

The vulnerability affects **Windows 11 25H2**. It does not currently work on Server editions or older Windows 11 builds, though reimplementations have already begun appearing on GitHub within days of the disclosure.

---

## How It Works — The Defender-Against-Defender Chain

BlueHammer is classified as a **TOCTOU (time-of-check to time-of-use) race condition** combined with **path confusion**. That description is technically accurate but undersells what makes this exploit architecturally interesting. It does not drop malware. It does not load unsigned drivers. It weaponizes native Windows functionality — Cloud Files API, batch oplocks, NTFS junctions, and Volume Shadow Copies — against a process running as SYSTEM.

Here is the kill chain, stage by stage.

The exploit begins by downloading a legitimate Defender signature update from Microsoft's own distribution endpoint. It parses the PE resource section, extracts the embedded cabinet file, and decompresses it in memory. Nothing malicious so far. This is exactly what Defender itself does.

Next, it forces a **Volume Shadow Copy** snapshot. The trick is elegantly simple: drop an EICAR test string (stored reversed in the binary to avoid triggering Defender prematurely) and let Defender's real-time protection react. The resulting VSS snapshot now contains a point-in-time copy of the **SAM hive** — the database holding NTLM password hashes for every local account on the machine.

Now the race begins. The exploit registers a **Cloud Files sync root** and connects a callback that identifies Defender's process by PID. When Defender accesses the expected signature file (`mpasbase.vdm`), the exploit takes a **batch oplock**, effectively freezing Defender mid-read. While Defender is paused, the exploit swaps the directory junction to point through `\BaseNamedObjects\Restricted` and creates a symbolic link targeting the SAM hive inside the VSS snapshot.

When the oplock releases, Defender resumes its read operation. But it is no longer reading a signature file. It is reading the SAM database. As SYSTEM. The exploit captures the contents, parses the hive using Microsoft's own offline registry library (`offreg.dll`), and extracts every local account hash on the machine.

From there: pass-the-hash, SYSTEM shell, full compromise.

> **Deobfuscated take:** What makes BlueHammer structurally interesting is that it contains zero traditionally "malicious" API calls up until the final credential extraction. Cloud Files API, oplocks, NTFS junctions, VSS — these are all legitimate, documented Windows features. Behavior-only detections that rely on "known-bad" API sequences will struggle here.

---

## Why "Local Only" Is Not a Mitigation

The instinctive response to a local privilege escalation is to deprioritize it. The attacker needs to already be on the box. True, but that framing belongs to a threat landscape that no longer exists.

**Infostealer infections deliver local access at industrial scale.** A single Lumma Stealer or Raccoon session (the kind that surfaces in Hudson Rock or KELA feeds daily) provides valid credentials that place an attacker exactly where BlueHammer becomes viable. Initial access brokers sell RDP and VPN sessions on underground markets for the price of a takeaway lunch. In MDR operations, the pattern we observe repeatedly is commodity initial access chaining into local privilege escalation chaining into domain compromise. BlueHammer slots into that sequence perfectly.

The exploit's complexity is also worth contextualising. The original PoC is admittedly rough; the researcher acknowledged bugs that may prevent reliable execution. But a clean reimplementation appeared on GitHub within 72 hours. The barrier to entry is dropping, not rising.

---

## What To Hunt For Right Now

There is no patch. Microsoft has issued a boilerplate statement about investigating reported security issues. Detection is your only lever, and BlueHammer's kill chain has several distinctive indicators that are observable with properly tuned XDR telemetry.

### RPC Endpoint Access

The exploit binds to the WinDefend RPC interface over ALPC (`ncalrpc`). Legitimate callers of `Proc42_ServerMpUpdateEngineSignature` are `MsMpEng.exe`, `MpCmdRun.exe`, and Windows Update components. Any other process touching this endpoint is anomalous. If your XDR supports RPC monitoring, write a rule for it.

### Cloud Files API Registration

`CfRegisterSyncRoot` and `CfConnectSyncRoot` are called by OneDrive and a handful of known sync providers. A previously unseen binary registering as a sync root provider, especially one that subsequently interacts with Defender's PID, should generate an alert.

### Junction and Symlink Creation in Temp Directories

The path confusion relies on NTFS junction swaps followed by `NtCreateSymbolicLinkObject` targeting restricted kernel object namespaces. Correlate junction creation events with Defender update activity within a 30–45 second window. The temporal proximity is the signal.

### Batch Oplock Acquisition on `.vdm` Files

This is the most distinctive single indicator. Signature definition files should only be accessed by Defender's own processes. A non-Defender process taking an oplock on `mpasbase.vdm` has no legitimate reason to exist.

### VSS Snapshot Creation Correlated with Non-Admin Activity

The EICAR-triggered shadow copy is a prerequisite for the SAM extraction. Unexpected VSS activity — particularly when correlated with the other indicators above — should elevate the alert priority.

For **Microsoft Defender XDR** environments, KQL queries monitoring `DeviceEvents` for non-Defender Cloud Files API interactions and `DeviceFileEvents` for junction creation correlated with signature update processes provide a practical starting point.

---

## The Disclosure Question

There is a conversation worth having about the circumstances that led to this public release — a researcher who felt unheard, an MSRC process that requires video demonstrations of exploits as a submission prerequisite, and a resulting zero-day with no patch timeline. That conversation matters for the long-term health of the vulnerability disclosure ecosystem.

But it is a separate conversation from the operational one. Right now, the code is public, reimplementations exist, and the affected component runs on every managed Windows endpoint.

---

## Immediate Actions

1. **Verify exposure**: Confirm whether Windows 11 25H2 is present in your endpoint estate. This version is the confirmed target; other builds are not currently affected.
2. **Deploy detection rules**: Prioritize oplock monitoring on `.vdm` files and Cloud Files API registration events from non-OneDrive processes. These are the highest-fidelity indicators available before a patch exists.
3. **Correlate VSS activity**: Alert on unexpected Volume Shadow Copy creation events, particularly when temporally correlated with Defender signature update processes.
4. **Harden initial access paths**: BlueHammer's practical risk is highest where infostealer-derived credentials or bought access already exists. Reduce the infostealer footprint by enforcing MFA on all remote access, rotating any credentials surfaced in threat intelligence feeds, and reviewing active RDP/VPN exposure.
5. **Patch when available**: Microsoft has acknowledged the report. Apply the fix as a P1 priority when it ships. No exceptions for endpoints running 25H2.
