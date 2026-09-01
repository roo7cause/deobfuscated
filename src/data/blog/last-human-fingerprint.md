---
title: "The Last Human Fingerprint: What Happens When the Observable Attacker Becomes Software?"
description: "A thought experiment on how autonomous attack systems could reshape threat actor attribution, behavioral fingerprints, and operational cyber threat intelligence."
author: David Kasabji
pubDatetime: 2026-09-01T09:00:00Z
category: "Research"
---

Threat actor attribution has always been one of the most fascinating, valuable and controversial disciplines within Cyber Threat Intelligence. When an intrusion is discovered, one of the first questions inevitably surfaces: **Who did this?**

The answer can influence how an organization understands the incident, what the attacker might do next, which information they may be pursuing and how the wider campaign should be interpreted. At the strategic level, attribution can shape national security assessments, diplomatic responses and our broader understanding of the threat landscape.

Yet attribution has never been an exact science. Analysts rarely identify an attacker because of one definitive artifact. Instead, attribution is built from overlapping pieces of evidence: infrastructure, malware families, operational patterns, targeting preferences, working hours, language artifacts, command syntax, historical behavior and tactics, techniques and procedures.

Individually, most of these signals prove little. Together, and especially when observed repeatedly across multiple operations, they can create something resembling an operational fingerprint.

But what happens when that fingerprint no longer belongs to a human operator? What happens when the observable attacker becomes software?

This is not an argument that attribution is dying, nor an attempt to predict exactly how adversary analysis will work five or ten years from now. It is a thought experiment about what happens when one of attribution's important assumptions begins to weaken: that the behavior we observe belongs, in some meaningful way, to the operator behind the intrusion.

## The gradual disappearance of the operator

Consider how an advanced intrusion might work several years from now.

An autonomous reconnaissance agent identifies exposed infrastructure and determines the most promising access paths. An exploitation agent generates or adapts the necessary code. Once access is established, another component enumerates identities, maps the environment, searches for credentials and determines how to progress toward the objective. An orchestration layer continuously evaluates the results, changes strategy when actions fail and coordinates persistence, collection and command and control.

The human operator may provide little more than the intent: compromise this organization, obtain information relating to a particular project, avoid unnecessary disruption and return the results.

Everything else could be delegated.

This is no longer entirely hypothetical. In November 2025, Anthropic disclosed an espionage campaign in which attackers used Claude Code not simply as an advisor, but to execute substantial portions of live intrusion operations. Anthropic assessed with high confidence that the activity was conducted by a Chinese state-sponsored group, which it tracks as GTG-1002. The operation targeted roughly 30 organizations, and Anthropic reported that AI performed the majority of tactical activity with limited human intervention.

Anthropic's subsequent 2026 research makes the attribution question even more interesting. GTG-1002 achieved the maximum possible **AI Risk Enablement Score, or ARiES, of 100**, yet its MITRE ATT&CK profile consisted of 30 techniques across 13 tactics, a profile comparable to dozens of medium-risk actors in Anthropic's dataset. Technique count alone did not explain why this operation was different. The more meaningful distinction was the **agentic scaffolding** surrounding the model: the architecture and tooling that allowed individual actions to be chained into an autonomous attack process.

That observation has consequences beyond measuring attacker sophistication. If autonomous systems increasingly decide _how_ an intrusion should be performed, many behaviors we currently associate with threat actors may eventually describe the software executing the attack more accurately than the organization controlling it.

## When TTPs stop telling us who is behind the keyboard

Tactics, techniques and procedures are deeply embedded in modern threat intelligence. Frameworks such as MITRE ATT&CK give analysts a common language for describing adversary behavior and allow intelligence to move beyond volatile indicators toward more durable patterns of activity.

MITRE describes tactics as the adversary's reason for performing an action, techniques as how that tactical goal is achieved and procedures as the specific real-world implementation of those techniques.

That distinction becomes particularly interesting when the executor is autonomous.

Tactics are unlikely to lose their relevance. An adversary still wants Credential Access, Discovery, Collection or Exfiltration regardless of whether a human or an AI system executes the operation. Techniques remain equally useful from a defensive perspective. Credentials still have to be obtained somehow. Systems still need to be discovered. Data still has to be collected.

The more fragile part, at least from an attribution perspective, may be the **procedure**.

Procedures traditionally carry useful behavioral context because they show how an adversary actually implements a technique. Human operators develop habits. They reuse scripts, favor certain tools, structure commands in recognizable ways and repeatedly solve similar problems according to previous experience. Over time, those choices can become part of a recognizable operational fingerprint.

An autonomous system behaves differently. It can evaluate the environment and choose whatever action appears most likely to achieve the objective.

Imagine two unrelated attackers using the same capable offensive agent against similarly configured Microsoft environments. Faced with the same controls and the same available privileges, the agent may independently discover the same attack path, choose the same credential-access method and attempt the same lateral-movement strategy.

Those operations would look similar not because the attackers share doctrine, training or organizational history, but because the software reached the same conclusion.

The reverse is equally important. The same threat actor could attack two organizations and produce very different procedures. Against one victim, the agent might obtain credentials through endpoint access. Against another, it might identify an identity weakness in the cloud and never attempt traditional credential dumping at all.

The procedure is no longer necessarily an expression of operator preference. It becomes a **runtime output of the reasoning system**.

This creates the possibility of significant behavioral convergence between otherwise unrelated actors. A ransomware affiliate, an intelligence service and an independent cybercriminal could generate surprisingly similar telemetry if the decision-making layer behind their operations relies on comparable models, tools and agent architectures.

Identifying the AI technology involved would certainly remain useful intelligence, but it would not constitute attribution. Saying that an intrusion used Claude, Gemini, an open-weight model or a particular offensive agent may eventually tell us little more about identity than saying that an attacker used Cobalt Strike does today.

The tool is not the operator.

## Beyond TTPs: attribution moves up the abstraction stack

This is where I think the attribution problem becomes particularly interesting.

I do not think AI makes MITRE ATT&CK obsolete. Quite the opposite. ATT&CK remains extraordinarily useful for describing what happened inside an environment and organizing defensive knowledge around observable behavior.

What I question is whether the procedure layer will continue to carry the same attribution value when procedures are increasingly generated at runtime.

Anthropic has identified a related gap from a different perspective. Its 2026 analysis notes that behaviors distinguishing highly capable agentic operations, including autonomous kill-chain orchestration, real-time decisions about what to do next and execution with limited human intervention, do not map neatly to existing ATT&CK techniques. Anthropic argues that the framework will need to evolve to capture these AI-enabled behaviors.

That raises a broader CTI question: if an autonomous system selects the techniques, perhaps the next useful fingerprint is not simply _which techniques were used_, but **how the system decided which techniques to use**.

I have struggled with what to call this missing analytical layer. "Prompts" feels too narrow because autonomous systems do not need to operate from stable natural-language prompts. "Processes" is too generic. For the purpose of this thought experiment, I think of them as **Agentic Operational Patterns**, or AOPs.

> **Agentic Operational Patterns are recurring characteristics in how an autonomous attack system plans, delegates, selects, adapts and escalates actions during an operation.**

AOPs would not replace TTPs. They would describe a different layer of the operation.

| AOP dimension            | What the analyst observes                                                                                                        |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| **Planning horizon**     | Does the system construct a multi-stage plan or continuously re-plan after each observation?                                     |
| **Delegation model**     | How are reconnaissance, exploitation and post-compromise objectives divided between agents or tools?                             |
| **Failure response**     | Does the system retry, pivot, abandon the path or systematically test alternatives when an action fails?                         |
| **Operational priority** | Does it consistently favor identity compromise, endpoint access, stealth, persistence or speed when several paths are available? |
| **Human escalation**     | Which decisions are autonomous, and which actions require approval or intervention from the operator?                            |

Put simply:

**TTPs describe what the attacker did. AOPs describe how the autonomous system decided what to do.**

Consider two intrusions with limited overlap at the procedure level. Different environments cause the agents to use different credential-access techniques, different commands and different persistence mechanisms. Traditional behavioral comparison might suggest that the operations are unrelated.

But suppose both systems enumerate identity infrastructure before endpoints. Both abandon an exploitation path after two unsuccessful attempts. Both prefer native functionality over introducing a custom payload. Both follow the same fallback logic when an action fails and require human approval before taking high-risk disruptive actions.

Suddenly the operations begin to look remarkably similar.

**The procedures differ. The reasoning fingerprint does not.**

An agentic operation may therefore require us to think beyond the familiar progression from tactic to technique to procedure. Another analytical layer exists between intent and execution: the decision process determining what happens next.

Conceptually, we might eventually think in terms of something closer to:

**Objective → Tactic → Decision → Technique → Procedure → Adaptation**

The terminology will almost certainly evolve. What matters is the analytical gap.

The decision layer has always existed when humans conduct intrusions, but analysts cannot normally inspect what happens inside an operator's head. With autonomous systems, portions of that reasoning are implemented in software. Under the right circumstances, that makes them observable.

If defenders obtain an orchestration framework, observe model interactions, reconstruct agent workflows or simply collect enough examples of how a system responds to different environments, it becomes possible to fingerprint characteristics of the architecture selecting the techniques.

Threat attribution has repeatedly moved upward when lower-level signals became unreliable. Static indicators became ephemeral, increasing the value of malware analysis and infrastructure correlation. Infrastructure became increasingly disposable, strengthening the focus on behavioral intelligence and TTPs.

If AI commoditizes TTP execution itself, attribution will have to move up the abstraction stack again, toward orchestration, decision policies, adaptation and ultimately intent.

## AI could poison attribution at scale

Moving up the abstraction stack does not solve the problem permanently. Once attackers understand which signals analysts value, they can attempt to manipulate those too.

False flags are not new to cyber operations. Threat actors have inserted foreign-language artifacts into malware, copied techniques associated with other groups and deliberately created misleading infrastructure patterns. Agentic AI dramatically reduces the effort required to produce those deceptions consistently and at scale.

Instead of manually reproducing another actor's behavior, an operator could instruct an autonomous system to imitate it. The agent could favor techniques associated with a particular cluster, alter coding or naming conventions and vary infrastructure and operational timing. Those characteristics could then change automatically between victims.

More importantly, an autonomous framework could select between several equally viable attack paths simply to prevent analysts from establishing consistent behavioral patterns.

This introduces what I would describe as **attribution poisoning**: deliberately generating or manipulating behavioral evidence to distort attribution assessments.

If analysts eventually begin fingerprinting agentic orchestration itself, sophisticated operators can target that layer too. Different planning strategies, models, agent structures or risk policies could be rotated between campaigns.

The problem becomes even more interesting as defensive attribution increasingly incorporates AI. Offensive systems would no longer need to deceive only human analysts. They could eventually optimize the signals they generate against the models used to cluster and classify threat activity.

Attribution then becomes partly an adversarial AI problem: one system constructing an identity while another tries to infer it.

## The human fingerprint may not disappear. It may move.

None of this makes attribution impossible. It changes where we should look for the strongest signals.

Even highly autonomous attacks still originate from intent. Someone defines the objective. Someone decides which organizations are worth targeting, which information is valuable and what level of operational risk is acceptable. Someone selects, builds or configures the models and infrastructure surrounding the operation.

Even if execution becomes almost entirely autonomous, the broader operation still reflects human or organizational priorities.

This pushes attribution away from individual endpoint behaviors and toward a more complete understanding of the operation surrounding them. Victimology, infrastructure relationships, geopolitical context, campaign timing, recurring intelligence requirements and the type of information repeatedly targeted become increasingly important when execution-level behavior is generated dynamically.

Infrastructure will still carry attribution value, although autonomous systems can make infrastructure reuse progressively rarer by provisioning servers, rotating domains and replacing compromised resources automatically.

At the same time, automation creates new fingerprints.

The agentic architecture itself becomes part of the intelligence picture. Its planning logic, memory design, tool configuration, decision policies and interaction between specialized agents can reveal relationships that endpoint telemetry alone cannot.

This is where AOPs become useful as an attribution hypothesis. The operator may no longer leave behind a recognizable series of commands, but the system they designed, selected or configured can repeatedly express the same operational priorities.

An espionage organization might optimize heavily for stealth and tolerate long periods of inactivity. A financially motivated operator may favor speed, repeatability and scalability. Another organization might impose human approval around destructive actions or consistently prioritize particular categories of information regardless of the technical environment.

The implementation changes, but the underlying operational philosophy can remain surprisingly stable.

**The human fingerprint may not disappear. It may move.**

## Attribution may become a privileged capability

There is another consequence of this transition: some of the best evidence for attributing an AI-enabled operation may not exist inside the victim organization at all.

An enterprise investigating its own compromise sees authentication events, processes, network traffic, files and security alerts. Those signals can provide an excellent reconstruction of what the attacker did inside the environment.

An AI provider sees a different part of the operation. It may observe which accounts interacted with models, how those models were incorporated into workflows, which capabilities were repeatedly invoked and whether apparently separate activity belongs to the same cluster. A hyperscaler, hosting company or major security vendor sees another fragment.

Anthropic's investigation of GTG-1002 illustrates this emerging asymmetry particularly well. Anthropic could observe how the attacker interacted with the AI system itself, including an operational layer that victim organizations could not independently reconstruct from their endpoint or network telemetry.

A future victim might therefore understand exactly how an autonomous attacker compromised its environment while possessing almost no evidence revealing who ultimately operated it. The missing pieces could exist across an AI provider, cloud platforms, infrastructure services and intelligence datasets collected from completely different victims.

High-confidence attribution increasingly depends on **broad visibility across ecosystems rather than deep visibility into one compromised organization**.

**Attribution may not disappear. It may become privileged.**

Only a relatively small number of organizations are likely to possess sufficient telemetry to perform it reliably at scale. AI companies and hyperscalers have unique visibility into the platforms supporting these operations. Large security vendors and CTI providers can correlate activity across many environments. Governments and intelligence services retain collection capabilities unavailable to the commercial sector.

Individual organizations may increasingly need to accept a different level of attribution. They might confidently establish that several incidents belong to the same activity cluster, understand its objectives and anticipate its next actions without possessing enough evidence to identify the organization or country ultimately responsible.

That can still be highly valuable intelligence.

Attribution does not have to end with a flag or a famous APT name to be operationally useful.

## Perhaps attribution matters less to defenders anyway

This leads to a more uncomfortable question: how much does precise attribution actually matter to operational defense?

Knowing that an intrusion is associated with a particular threat actor provides valuable context. Historical intelligence may reveal likely objectives, capabilities and expected follow-on behavior. Strategic attribution will continue to matter.

But its operational value changes when attack timelines collapse.

If an autonomous system can perform reconnaissance, exploitation, credential access and lateral movement at machine speed, defenders cannot wait for a sophisticated attribution assessment before deciding what to do. During the attack itself, whether an intrusion ultimately belongs to APT28, APT29 or an entirely new cluster matters less than understanding the capability operating inside the environment.

The immediate questions are different. What can this attacker do? Which access path is being exploited? What identities are at risk? Which controls stopped the activity? Where else should we hunt?

That does not make attribution irrelevant. It separates **strategic attribution from operational defense**.

And that distinction becomes increasingly important in the agentic era.

## CTI in an era of extreme attack acceleration

If attribution becomes harder while attacks become faster, Cyber Threat Intelligence does not lose relevance. Its center of gravity changes.

Historically, a significant part of CTI has been organized around actors: who they are, which malware they use, which sectors they target and which techniques characterize their operations. That model remains valuable, particularly for strategic intelligence, but operational CTI increasingly needs to answer a more time-sensitive question:

**What can attackers do right now?**

If offensive capabilities become easier to reproduce through AI, intelligence about a novel exploitation path, identity attack or defensive bypass will have a much shorter period of exclusivity. A technique observed today could be replicated by otherwise unrelated actors tomorrow.

Threat intelligence therefore needs to move faster.

Instead of primarily producing retrospective descriptions of campaigns, operational CTI needs to shorten the distance between **observation and countermeasure**.

Imagine a newly identified attack technique entering an intelligence pipeline. The organization determines which assets or identities may be affected, searches existing telemetry for evidence of exploitation and generates appropriate hunting or detection logic. Temporary mitigations can be proposed while more durable defensive content is developed.

This begins to resemble **Just-In-Time Defensive Content**: intelligence translated into organization-specific detections, threat-hunting logic or compensating controls at a speed much closer to the evolution of the threat itself.

Security vendors will automate much of this, but no single vendor sees the entire threat landscape or understands every organization's environment. CTI becomes the intelligence layer that determines what is relevant, connects observations across sources and translates external change into defensive action.

This acceleration also changes the consequences of basic security weaknesses. Least privilege, network segmentation, strong identity controls and secure configuration are hardly new concepts, but autonomous attacks reduce the time organizations have to compensate for failing to implement them. A weak identity or poorly isolated network becomes far more dangerous when software can discover and exploit it almost immediately.

The fundamentals remain the same. The tolerance for ignoring them becomes smaller.

## The last human fingerprint

Threat actor attribution is unlikely to disappear in the age of AI, but some of the assumptions underlying it are already worth challenging.

Techniques remain valuable descriptions of adversary behavior. Procedures, however, can become increasingly ephemeral when autonomous systems select and generate them according to the environment they encounter. Behavioral convergence can make unrelated actors appear similar, while attribution poisoning can make the same actor appear different from one operation to another.

That forces attribution upward.

The next durable fingerprint may not be the command an attacker executes or even the technique it selects. It may lie in the operational logic determining why one action was chosen over another: planning, delegation, decision policies, risk tolerance, adaptation and the underlying objective.

Perhaps Agentic Operational Patterns will prove useful for describing that layer. Perhaps MITRE ATT&CK itself will evolve to capture much of it, as the current discussion around agentic behavior already suggests. Or perhaps the industry will develop entirely different models.

The label is less important than the gap it attempts to describe.

At the same time, attribution evidence is moving beyond the compromised environment. AI providers, hyperscalers, infrastructure companies, major security vendors and intelligence services can each possess pieces of an attribution puzzle that no individual victim can independently reconstruct.

For operational defenders, that may ultimately matter less than it first appears. Their immediate responsibility is not to name the attacker. It is to understand the capability, anticipate its next move and stop it.

For Cyber Threat Intelligence, that represents an evolution rather than a decline. Actor knowledge remains valuable, but the intelligence advantage increasingly comes from understanding what has changed in the threat landscape before that change reaches your environment.

We may therefore enter a strange period in cybersecurity where defenders become extraordinarily capable of describing **what** is attacking them while becoming progressively less certain about **who** is behind it.

Perhaps the last reliable human fingerprint will not be found in the command the attacker executed.

It will be hidden in the system that decided to execute it.

And the question is no longer simply whether attribution will survive. It is **who will still possess the visibility, expertise and scale required to perform it reliably when the observable attacker is no longer human.**
