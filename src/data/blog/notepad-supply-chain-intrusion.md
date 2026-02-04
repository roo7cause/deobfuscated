---
title: "Notepad++ Supply Chain Compromise: Hunting for What the IOC Lists Miss"
description: "A threat intelligence breakdown of the Notepad++ update hijack — with detection strategies that go beyond published indicators."
author: David Kasabji
pubDatetime: 2026-02-04T09:00:00Z
category: "Intrusion Log"
---

## TL;DR

- Chinese state-sponsored actors compromised Notepad++'s hosting infrastructure and hijacked its update mechanism for six months (June–December 2025).
- [Three distinct infection chains](#the-three-chains-mapped) were deployed sequentially, each with entirely different IOCs — meaning defenders who only checked the publicly known Chain #3 indicators may have missed earlier compromise.
- The updater (WinGUp) lacked signature verification on downloaded binaries, turning a trusted update channel into an unmonitored malware delivery pipeline.
- Below, we break down detection strategies that go beyond IOC matching — focusing on behavioral hunts, infrastructure patterns, and the structural weaknesses that made this possible.

---

## What Happened

In early February 2026, multiple security teams — Rapid7, Kaspersky GReAT, and independent researcher Kevin Beaumont — disclosed that the Notepad++ update infrastructure had been compromised at the hosting provider level since June 2025. The attackers didn't touch the Notepad++ source code. Instead, they gained control of the shared hosting server and manipulated `getDownloadUrl.php` — the script that WinGUp queries to fetch installer URLs — to selectively redirect update requests from targeted users to attacker-controlled servers.

The targeting was surgical. Most users received legitimate updates. A handful of organizations — telecom providers and financial institutions in East Asia, a Philippine government entity, a Salvadoran financial institution, and a Vietnamese IT services company — received trojanized installers instead.

The hosting server was directly compromised until September 2, 2025, when a routine kernel update broke the attackers' access. But they had already harvested internal service credentials, which allowed them to continue redirecting update traffic until December 2, 2025.

### Timeline

| Date | Event |
| --- | --- |
| **Jun 2025** | Shared hosting server compromised; attackers gain access to `getDownloadUrl.php` |
| **Late Jul – Early Aug 2025** | Chain #1 deployed — ProShow sideload delivering Cobalt Strike via Metasploit |
| **Sep 2, 2025** | Hosting server kernel/firmware update breaks direct server access |
| **Mid Sep 2025** | Chain #2 deployed — Lua interpreter-based sideloading with Cobalt Strike |
| **Sep – Dec 2025** | Attackers maintain access via stolen internal service credentials, continue redirecting update traffic |
| **Early Oct 2025** | Chain #3 deployed — BluetoothService sideload delivering Chrysalis backdoor |
| **Mid-Late Oct 2025** | Chain #2 resumes with modified C2 URLs |
| **Mid Nov 2025** | Active payload delivery assessed to have ceased |
| **Nov 30, 2025** | WinGUp [commit ce00375](https://github.com/notepad-plus-plus/wingup/commit/ce00375) adds binary signature verification |
| **Dec 1, 2025** | Notepad++ website migrated to new hosting provider |
| **Dec 2, 2025** | All attacker credential access revoked; redirection definitively terminated |
| **Dec 15, 2025** | Notepad++ v8.8.9 released with signature verification enforced in WinGUp |
| **Jan 29, 2026** | WinGUp commit adds XMLDSig verification for update manifest XML |
| **Feb 2, 2026** | Public disclosure by Rapid7, Kaspersky GReAT, and Kevin Beaumont |

---

## Why This One Matters More Than Most

Supply chain attacks against open-source developer tools are not new. What makes this case particularly instructive is the combination of three factors:

### 1. The update channel had no integrity verification

Prior to v8.8.9, WinGUp did not verify the certificate or signature of downloaded installers. We can confirm this by examining the [WinGUp source code](https://github.com/notepad-plus-plus/wingup). In the vulnerable version of `winmain.cpp`, the main update path looked like this:

```cpp
// Hash parameter passed as empty string — no hash verification
bool dlSuccessful = downloadBinary(gupDlInfo.getDownloadLocation(),
                                    dlDest, L"", ...);
if (!dlSuccessful) return -1;

// Downloaded binary executed immediately — no signature check
return runInstaller(dlDest, gupParams.getClassName(), msg, ...);
```

The call to `downloadBinary()` passes `L""` as the hash parameter — explicitly skipping hash verification. The downloaded file then flows directly into `runInstaller()`, which calls `ShellExecute()` on whatever was downloaded. No `SecurityGuard`, no `verifySignedBinary()`, no certificate validation of any kind — those strings don't appear anywhere in the pre-fix codebase.

The fix landed in [commit ce00375](https://github.com/notepad-plus-plus/wingup/commit/ce00375) (Nov 30, 2025), which introduced a `SecurityGuard` class and inserted a verification gate between download and execution:

```cpp
if (doCheckSignature) {
    bool isSecured = securityGuard.verifySignedBinary(dlDest);
    if (!isSecured) return -1;
}
```

A subsequent commit (Jan 29, 2026) added XMLDSig verification for the update manifest XML itself — preventing attackers from tampering with the download URLs returned by `getDownloadUrl.php`. This second layer is scheduled for enforcement in v8.9.2.

The gap between these two defenses matters: v8.8.9 verifies the downloaded binary, but the XML manifest pointing to the download URL is still unsigned until v8.9.2. An attacker who could still manipulate the manifest could redirect downloads to a server hosting a validly signed but malicious binary — a narrower attack surface, but not a closed one.

### 2. The attackers rotated their entire toolchain monthly

Between July and October 2025, three completely separate infection chains were deployed — different binaries, different C2 infrastructure, different sideloading techniques, different payloads. This is not typical of commodity operations. It reflects an operator with deep resources and a deliberate strategy to limit the blast radius of any single detection.

### 3. Public disclosure covered only the final chain

Kaspersky's research revealed that the initially published IOCs — the ones most defenders scanned for — corresponded only to Chain #3 (the Chrysalis backdoor via BluetoothService sideloading). Chains #1 and #2 used entirely different IPs, domains, and file hashes. Organizations that ran IOC sweeps against the first round of public indicators and found nothing may still have been compromised by earlier chains.

---

## The Three Chains, Mapped

Here's how the infection chains evolved. Each one represents a full retooling of the delivery and post-exploitation stack:

```text
Chain #1 (Jul–Aug 2025)
  update.exe (NSIS) → ProShow.exe sideload → Metasploit loader → Cobalt Strike
  C2: cdncheck.it[.]com, 45.77.31[.]210

Chain #2 (Sep–Oct 2025)
  update.exe (NSIS) → Lua interpreter (script.exe) → alien.ini shellcode → Cobalt Strike
  C2: safe-dns.it[.]com, self-dns.it[.]com

Chain #3 (Oct 2025)
  update.exe (NSIS) → BluetoothService.exe sideload → log.dll → Chrysalis backdoor
  C2: api.skycloudcenter[.]com, api.wiresguard[.]com
```

What ties them together: all three used NSIS installers delivered through the hijacked WinGUp channel, and the Cobalt Strike beacons across chains shared the XOR configuration key `CRAZY`.

---

## Attribution: Competing Assessments

Two independent attributions have been published, pointing to different — but potentially overlapping — Chinese APT clusters:

- **Kevin Beaumont** attributed the campaign to **Violet Typhoon** (also tracked as APT31/Zirconium), based on victimology and operational patterns.
- **Rapid7** attributed it to **Lotus Blossom** (aka Billbug, Lotus Panda, Raspberry Typhoon), based on tooling overlaps with prior Lotus Blossom campaigns — specifically the reuse of Bitdefender binaries for DLL sideloading, a technique documented by Symantec in April 2025.

These aren't necessarily contradictory. Chinese APT taxonomy is notoriously fragmented, and operational overlap between clusters is common. What matters for defenders is less the label and more the tradecraft: DLL sideloading via renamed legitimate security vendor binaries, Cobalt Strike with custom configurations, and purpose-built implants designed for long-term espionage.

---

## Are You Exposed? A Practical Threat Hunt

The standard advice — "check the IOCs" — is necessary but insufficient here. Given the chain rotation, a negative IOC sweep does not equal a clean bill of health. Here's a structured approach:

### 1. Establish Your Exposure Window

Determine whether Notepad++ was installed and updated via WinGUp between June and December 2025. Key questions:

- Is Notepad++ deployed in your environment? Check software inventory or hunt for `notepad++.exe` process execution.
- What version is installed? Versions prior to **8.8.9** used the vulnerable WinGUp updater without signature verification.
- Did any instance auto-update during the compromise window? Look for `gup.exe` (WinGUp) process execution in EDR telemetry between June 1 and December 2, 2025.

If the answer to all three is yes, proceed to active hunting.

### 2. Hunt for WinGUp-Spawned Processes

The most reliable behavioral indicator across all three chains is the process lineage. In every case, the attack begins with `gup.exe` (the legitimate updater) launching a downloaded NSIS installer:

- **Hunt query**: Any child process of `gup.exe` that is not a known Notepad++ installer signed by the Notepad++ project.
- **Specific tell**: `gup.exe` spawning processes that create files in `%localappdata%\Temp\ns*.tmp` directories (NSIS staging behavior).
- **Escalation indicator**: `gup.exe` → `update.exe` → any process performing system reconnaissance (`whoami`, `tasklist`, `systeminfo`, `netstat -ano`).

### 3. Check for Sideloading Artifacts

Each chain dropped files into specific `%appdata%` subdirectories. These paths are unusual for legitimate software and serve as high-fidelity indicators:

- `%appdata%\ProShow\` — Chain #1. Look for `ProShow.exe` and a file named `load`.
- `%appdata%\Adobe\Scripts\` — Chain #2. Look for `script.exe`, `lua5.1.dll`, and `alien.ini`.
- `%appdata%\Bluetooth\` — Chain #3. Look for `BluetoothService.exe`, `log.dll`, and a file named `BluetoothService` (shellcode blob).

The presence of legitimate vendor binaries (Bitdefender, ProShow) in user-writable `%appdata%` directories — rather than their normal installation paths — is a strong anomaly signal regardless of whether the specific hashes match published IOCs.

### 4. Network-Level Hunting

**LOLC2 services**: All three chains used Living-off-the-Land C2 techniques. Chain #1 exfiltrated system information to `temp[.]sh`, a legitimate temporary file-sharing service. Hunt for:

- DNS resolutions or HTTP requests to `temp[.]sh` from endpoints that shouldn't be using it.
- HTTP requests embedding system hostnames or usernames in User-Agent strings or request bodies.

**C2 domain patterns**: The attackers favored domains that mimic legitimate infrastructure services:

- `cdncheck.it[.]com`, `safe-dns.it[.]com`, `self-dns.it[.]com` — infrastructure-themed .com domains on `.it[.]com` subdomains.
- `api.skycloudcenter[.]com` — cloud service impersonation.
- `api.wiresguard[.]com` — VPN tool impersonation (note the deliberate typo of WireGuard).

Hunt for outbound HTTPS connections to recently registered domains matching these naming patterns, especially from hosts running Notepad++.

**Cobalt Strike beacon detection**: The beacons used XOR key `CRAZY` for configuration encryption. If you have memory forensics capability or EDR with memory scanning:

- Run CobaltStrikeScan or similar tooling against process dumps from the exposure window.
- Look for Cobalt Strike Malleable C2 profiles with URI patterns like `/api/update/v1`, `/api/FileUpload/submit`, `/api/Metadata/submit`, or `/dns-query`.

### 5. Chrysalis-Specific Detection

The Chrysalis backdoor (Chain #3) has several distinctive behaviors:

- **C2 URL structure** mimics DeepSeek traffic. The Chrysalis C2 URL is `api.skycloudcenter[.]com/a/chat/s/{GUID}` — this is a deliberate impersonation designed to blend into proxy logs where AI tool usage is common. The mimicry operates on multiple levels: the `api.` subdomain prefix mirrors `api.deepseek.com`, the `/chat/` path component resembles AI chat endpoints, and the trailing GUID makes each request look like a unique chat session retrieval. However, the pattern is distinguishable. DeepSeek's actual API endpoint is `api.deepseek.com/chat/completions` — a flat path with no session identifiers. The `/a/chat/s/{GUID}` structure doesn't match any documented DeepSeek API or web interface path. In a proxy log, any request matching `/a/chat/s/{GUID}` that isn't going to `deepseek.com` is anomalous and worth investigating.
- **Persistence**: Chrysalis establishes persistence via service creation or registry Run keys. Audit services and autorun entries created between October and December 2025 on exposed hosts.
- **API resolution**: Uses custom FNV-1a + MurmurHash-style API hashing rather than standard GetProcAddress calls — detectable in memory with appropriate YARA rules.
- **Warbird abuse**: A loader variant abused `NtQuerySystemInformation` with Microsoft Warbird parameters to execute within memory space mapped to Microsoft-signed binaries. This is a novel evasion technique — hunt for unusual `NtQuerySystemInformation` calls with non-standard information class parameters.

---

## Structural Lessons: Beyond This Incident

This compromise exposes patterns that extend well beyond Notepad++:

### The Update Channel as an Unmonitored Trust Boundary

Most organizations treat software update mechanisms as inherently trusted. EDR policies often whitelist updater processes. Network security tools don't inspect update traffic differently from other HTTPS flows. This creates a blind spot: if the update channel is compromised, the malware arrives through the one path least likely to be scrutinized.

**Tactical recommendation**: Treat auto-update mechanisms for third-party software as a distinct attack surface. Where possible, download updates from vendor sources manually or through a controlled software distribution pipeline. For tools that must auto-update, monitor the updater process for anomalous child processes and network destinations.

### Shared Hosting as a Supply Chain Risk

The root cause wasn't a vulnerability in Notepad++ — it was a shared hosting server. The application's update infrastructure sat on the same server as potentially dozens of other tenants. A compromise of any tenant — or the hosting provider itself — could pivot to the update pipeline.

**Tactical recommendation**: For software projects your organization depends on, understand where the update infrastructure lives. Shared hosting, single-server architectures, and PHP-based update endpoints without cryptographic signing are red flags. Factor this into your software risk assessment alongside the usual CVE tracking.

### IOC Rotation as a Deliberate Counter-Intelligence Measure

The monthly retooling of infection chains was not accidental. It's a pattern we see in mature espionage operations: the actors assume their infrastructure will eventually be burned, so they design for disposability. This means that IOC-centric detection — while necessary for known campaigns — will always be playing catch-up against operators who treat indicators as consumable.

**Tactical recommendation**: Complement IOC matching with behavioral detection. The behaviors that were constant across all three chains — `gup.exe` spawning unexpected processes, NSIS installer artifacts in temp directories, DLL sideloading from `%appdata%` subdirectories, system reconnaissance command sequences — are more durable detection anchors than any specific hash or domain.

---

## Key Indicators

**Malicious Update Servers**
- `45.76.155[.]202`
- `45.32.144[.]255`
- `95.179.213[.]0`

**C2 Domains**
- `cdncheck.it[.]com`
- `safe-dns.it[.]com`
- `self-dns.it[.]com`
- `api.skycloudcenter[.]com`
- `api.wiresguard[.]com`

**LOLC2**
- `temp[.]sh` (legitimate service abused for data exfiltration)

**Sideloading Paths**
- `%appdata%\ProShow\`
- `%appdata%\Adobe\Scripts\`
- `%appdata%\Bluetooth\`

**Cobalt Strike Config**
- XOR key: `CRAZY`
- Beacon URIs: `/api/update/v1`, `/api/FileUpload/submit`, `/api/Metadata/submit`, `/dns-query`, `/resolve`

**Chrysalis C2 Pattern**

- URI: `/a/chat/s/{GUID}` (mimics DeepSeek-style AI chat traffic — does not match any real DeepSeek endpoint)

For full file hashes and extended IOC lists, refer to the [Kaspersky GReAT report](https://securelist.com/notepad-supply-chain-attack/118708/) and the [Rapid7 Chrysalis analysis](https://www.rapid7.com/blog/post/tr-chrysalis-backdoor-dive-into-lotus-blossoms-toolkit/).

---

## Immediate Actions

1. **Inventory** Notepad++ installations and identify any running versions below 8.8.9.
2. **Update** all instances to 8.8.9 or later immediately. Version 8.9.2 will enforce XMLDSig verification on update manifests — upgrade to that when available.
3. **Hunt** using the behavioral indicators above, not just the published hash lists. Prioritize the process lineage and sideloading path checks.
4. **Block** the C2 domains and IPs listed above at your network perimeter and in EDR policies.
5. **Audit** any host where `gup.exe` executed during the exposure window for signs of reconnaissance commands, persistence mechanisms, or lateral movement.

The attackers are assessed to have ceased active operations in mid-November 2025, but the implants they deployed — particularly Chrysalis — are designed for long-term persistence. A clean IOC sweep is not sufficient. Behavioral hunting is required.
