---
title: "The Phases of AI-based Cyber Threats: Welcome to the Excitement Phase"
description: "A simple four-phase model for AI-driven cyber threats—and why we're entering the Excitement Phase (with more noise than maturity)."
author: David Kasabji
pubDatetime: 2026-02-16T09:00:00Z
category: "Diary"
---

There is so much buzz around Artificial Intelligence and its impact on cybersecurity right now that it has become increasingly difficult to distinguish between genuine advancement and inflated hype. Every week we see new headlines claiming AI can find countless zero-day vulnerabilities, autonomously breach enterprise networks, or render traditional defenses obsolete. Some of these claims have real substance behind them. Others do not.

I have been thinking about this a lot lately and I came up with a simple model to help frame where we actually stand. I call it **The Phases of AI-based Cyber Threats**:

1. **The Immature Phase** — AI is experimental; both sides tinker, but real-world impact is negligible.
2. **The Excitement Phase** — Both threat actors and defenders begin integrating AI/LLM-based tools into their workflows, but the technology is far from production-ready on either side.
3. **The Sophistication Phase** — AI matures to the point where it fundamentally changes tradecraft, requiring entirely new countermeasures.
4. **Back to Cat & Mouse** — The dust settles, and we return to the adversarial cycle we have always known, just at a higher baseline.

I believe we are currently shifting into **Phase 2: The Excitement Phase**. And this blog post is about what that actually means for defenders — and why the picture is not as grim as the headlines suggest.

> **Thesis:** The potential is real, but the gap between controlled demonstrations and operational reality is still significant — and that creates an opportunity for defenders.

---

## The Excitement Phase: Lots of Noise, Limited Maturity

What characterizes this phase is adoption without readiness. On both sides of the fence, people are starting to integrate LLMs and LLM-based tools into their production environments. Threat actors are experimenting with AI for reconnaissance, phishing at scale, and code generation. Defenders are deploying AI-driven detection, automated triage, and vulnerability scanning. But here is the thing that nobody likes to say out loud: these tools are not production-ready for either side. Not yet.

On the offensive side, we have seen demonstrations that are genuinely impressive. Carnegie Mellon University, in collaboration with Anthropic, demonstrated in 2025 that LLMs can autonomously plan and execute multi-stage network attacks, successfully replicating the 2017 Equifax breach in a controlled lab environment. The LLM scanned for vulnerabilities, deployed exploits, installed malware, and exfiltrated data — all without human intervention in the planning loop. That is a remarkable research outcome.

But it is worth paying attention to the nuance. The lead researcher, Brian Singer, was explicit about the limitations. The system required a carefully structured hierarchical architecture, where the LLM acted as a high-level strategist while specialized sub-agents handled the low-level execution. Without these abstractions, the same LLMs — equipped only with common security knowledge — failed. Singer also cautioned that the system only works under specific, constrained conditions and is nowhere near ready for uncontrolled deployment.

This is exactly the pattern of the Excitement Phase. The potential is real, but the gap between controlled demonstrations and operational deployment in the wild is still significant.

---

## The Perimeter Fixation: AI Finds Vulnerabilities, But So What?

A large portion of the current AI-in-cybersecurity discourse focuses on vulnerability discovery and perimeter breaching. AI tools like Trend Micro's ÆSIR platform have been uncovering zero-day vulnerabilities in AI infrastructure at impressive speed. Researchers used OpenAI's o3 model to discover CVE-2025-37899, a critical use-after-free vulnerability in the Linux kernel's ksmbd, by simulating multi-threaded behavior to identify memory reuse patterns that would take a human researcher considerably longer to find.

These are not trivial findings. AI is genuinely accelerating the discovery of bugs in production code, and this trend will continue to grow.

But if you zoom out, you will notice something: the entire conversation is centered on initial access. Finding vulnerabilities. Breaching the perimeter. Getting in.

In cybersecurity, we have an old and well-proven principle: **Assume Breach**. The premise is simple — your perimeter will eventually fail. A zero-day will be exploited, credentials will be stolen, a supply chain will be compromised. The question is not *if* an adversary gets in, but *what happens after they do*.

If we truly adhere to the Assume Breach mindset, then the obsession with AI-powered perimeter breaching, while valid, is only half the story. The other half — the post-intrusion defense — is where the real conversation should be.

---

## More Initial Access Vectors, But Not Defenseless

Let me be clear: I am not dismissing the threat. The consequence of threat actors leveraging AI to discover more initial access vectors *will* correlate with a higher quantity of cyber incidents in the near future. The math is straightforward — lower the cost and effort required to find entry points, and you get more intrusions. According to data aggregated from 2025 breach reports, ransomware was present in 44% of all breaches analyzed, with 8,149 victims listed by ransomware groups — a 33% year-over-year increase. The attack surface is growing, and AI will accelerate that trend.

But we are not defenseless. We just need to shift our focus.

If threat actors primarily leverage AI for the perimeter — which is where we see the most practical application today — then our response should be to double down on what we do best: **layered defense in depth**, with special emphasis on post-intrusion detection and response. Perimeter defenses remain important, but they should not be the centerpiece of your security strategy. They never should have been.

---

## AI in Post-Intrusion: The Adversary's Achilles Heel

Here is where the conversation gets interesting, and where I believe most commentary gets it wrong.

Much of the fear-driven narrative assumes that if AI can breach a perimeter, it can also navigate a complex internal environment, perform lateral movement, escalate privileges, discover crown jewels, and exfiltrate data — all autonomously and effectively. That is a massive leap.

The reality of today's AI, particularly LLMs, is that they have a dangerously high tendency to hallucinate. They generate plausible-sounding but factually incorrect outputs. In a post-intrusion scenario, this is not just a minor inconvenience — it is an operational catastrophe for the attacker. Imagine an AI-driven adversary that confidently identifies the wrong system as the domain controller, attempts lateral movement to a honeypot thinking it is a file server, or generates PowerShell commands that look correct but fail silently in the specific environment it has landed in.

In post-intrusion operations, context is everything. An attacker needs to understand the specific Active Directory structure, the unique network segmentation, the custom applications, and the particular security controls of the victim's environment. This kind of situated reasoning is exactly where current LLMs break down. They work well with generalized knowledge; they struggle with the kind of environmental specificity that successful post-intrusion operations demand.

In other words: if threat actors were to rely on AI for post-intrusion activities with the current state of the technology, it would actually **slow them down**. The AI would lead them into rabbit holes — wasting time, generating noise, and increasing the chance of detection.

---

## Deception: The Obvious Countermeasure Nobody Is Talking About

This brings me to what I believe is the most effective — and most underappreciated — countermeasure for this specific phase of AI-based cyber threats: **deception technology**.

Honeypots, honeytokens, and broader deception platforms have existed for decades, but they have never been more relevant than they are right now. The reason is simple: AI systems, in their current state, think like machines. They follow patterns, respond to signals, and process data without the intuitive skepticism that an experienced human operator would apply.

A well-configured deception layer inside your internal environment would be devastating to an AI-driven adversary. Consider what happens when an AI agent performs internal reconnaissance and encounters a fake SMB share with enticing file names, or a decoy Active Directory account with admin-sounding privileges, or a honeypot server responding to RDP on a seemingly critical subnet. A human attacker with experience might pause and question why something feels too easy or too convenient. An AI, operating on pattern recognition and probabilistic reasoning, would not. It would engage. And the moment it does, your detection stack lights up.

The beauty of deception against AI-driven threats is the asymmetry. The defender needs to plant convincing decoys. The AI needs to correctly identify and avoid every single one of them. In the current state of AI, that is not a realistic expectation. LLMs do not possess the environmental awareness or the adversarial intuition needed to distinguish a well-crafted honeypot from a real production asset. They process the signals they receive, and if those signals suggest a high-value target, they engage.

This is a rare situation in cybersecurity where the defender has a genuine structural advantage, and we should capitalize on it.

---

## A Window, Not a Permanent State

I want to be honest about the limitations of my own argument. The Excitement Phase is a window. It will not last forever.

As AI models improve — as they get better at contextual reasoning, environmental adaptation, and adversarial awareness — the effectiveness of current deception techniques will diminish. We will enter what I call the **Sophistication Phase**, where AI-driven adversaries can navigate internal environments with something closer to human-level judgment. When that happens, we will need entirely new categories of countermeasures.

But I believe we have a few years before we get there. The gap between controlled research demonstrations and real-world operational deployment by threat actors is still significant. Even the Carnegie Mellon study, which represents some of the most advanced work in this area, acknowledged that the system is a research prototype operating under constrained conditions.

This gives defenders time. Time to invest in deception. Time to strengthen post-intrusion detection. Time to build the muscle memory for layered defense that does not depend on the perimeter holding. The organizations that use this window wisely will be far better positioned when the Sophistication Phase arrives.

---

## What Should Defenders Do Now?

If you accept the premise that we are in the Excitement Phase, the practical implications are relatively straightforward:

- **Embrace the Assume Breach mindset.** If AI is making it cheaper and faster for attackers to find initial access vectors, your perimeter will be tested more frequently. Plan accordingly.
- **Invest in post-intrusion detection.** This means robust endpoint detection and response, network traffic analysis, behavioral analytics, and thorough log coverage. The faster you detect an adversary after they breach the perimeter, the less time they have to accomplish their objectives.
- **Deploy deception technology.** Honeypots, honeytokens, fake credentials, decoy file shares. These are low-cost, high-signal defensive tools that are particularly effective against automated and AI-driven adversaries.
- **Do not over-index on AI for defense either.** The same maturity gap that limits offensive AI also applies to defensive AI. Use AI-assisted tools where they genuinely add value — alert triage, log correlation, threat hunting support — but do not replace human judgment with AI judgment. Not yet.
- **Prepare for the next phase.** The window we have now is an opportunity to build the defensive foundations that will matter when AI-driven adversaries become more sophisticated.

---

## Final Thoughts

The discourse around AI and cybersecurity is dominated by extremes. On one end, there are claims that AI will make all defenses obsolete. On the other, there are dismissals that AI is just another overhyped technology. Neither position is accurate.

The reality is that we are in a transitional phase where both threat actors and defenders are adopting AI tools that are promising but immature. The threat landscape is shifting — more initial access attempts, faster vulnerability discovery, more scalable social engineering. These are real and measurable trends.

But the defensive playbook has not changed as much as the headlines suggest. Assume Breach. Defend in depth. Focus on detection and response, not just prevention. And for this particular moment in time, lean into deception — because it is the one area where the current limitations of AI work decisively in the defender's favor.

The thin line between exaggeration and reality is drawn by which phase we are in. Right now, we are in the Excitement Phase. Let us use it wisely.
