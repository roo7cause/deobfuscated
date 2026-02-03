---
title: "[CDF - Part 1]: Why IOC Infrastructure Fails at Scale"
description: "Any intrusion intelligence that isn't shared has near-zero value. In this framework, we learn how to build a scalable IOC disseminator."
author: David Kasabji
pubDatetime: 2026-01-27T09:00:00Z
category: "Frameworks"  # Choose: "Intrusion Log", "Frameworks", "Research", or "Diary"
# Optional fields (uncomment if needed):
# modDatetime: 2026-01-28T10:00:00Z  # Last modification date
# featured: true  # Show on homepage
# draft: true  # Hide from public (useful for work-in-progress)
# ogImage: "/path/to/image.png"  # Custom Open Graph image
---

Most organizations don’t struggle to **collect** indicators of compromise (IOCs).  
They struggle to **turn indicators into reliable defense**, and to do it in a way that scales beyond a handful of feeds, a few power users, and a best-effort process.

At first, the plan seems straightforward:

1. Ingest threat feeds  
2. Enrich indicators  
3. Push them into detection and blocking controls  
4. Share relevant intelligence with partners  

Then reality hits. Volume rises, quality varies, context is missing, and every “quick integration” becomes another fragile dependency. Eventually the IOC pipeline turns into a noisy machine that produces either **alert fatigue** or **false confidence**—sometimes both.

This post is the first entry in a multi-part series on the **Collective Defense Framework (CDF)**. In Part 1, we’ll stay in the problem space: why IOC programs fail, why sharing is harder than it should be, and what characteristics a scalable approach must have.

---

## The core problem: IOC *volume* is not the same as IOC *value*

Many teams measure maturity by how many indicators they ingest.

But more indicators usually means:

- More noise in the SOC queue
- More false positives from shared infrastructure
- More collateral damage when blocking
- More engineering effort keeping the pipeline alive

This creates a common failure loop:

**More feeds → more data → more noise → less trust → less usage → “the system doesn’t work.”**

                (feeds)         (lists)         (tools)
             .----------.    .----------.    .----------.
             |  TI FEED | -> | IOC LIST | -> | SIEM/EDR  |
             '----------'    '----------'    '----------'
                    \             \               \
                     \             \               \
                      \             \               v
                       \             \        .-----------.
                        \             \-----> |  ALERTS!! |
                         \                    '-----------'
                          v
                   .-----------------.
                   |   TOO MUCH      |
                   |     NOISE       |
                   '-----------------'
                     \    \    \
                      \    \    \____  false positives
                       \    \_________  duplicated indicators
                        \______________  low signal volume


When trust drops, analysts stop relying on the IOC pipeline, detection rules become inconsistent across teams, and leadership starts questioning why “all this intelligence” isn’t reducing incidents.

---

## Why IOC programs fail at scale

### 1 Relevance is undefined (so everything becomes “high priority”)

The number one scalability issue is not technical — it’s *scoping*.

Without a strong notion of “relevance,” the default becomes:

- Ingest broadly “just in case”
- Distribute widely “so everyone benefits”
- Let downstream tools or analysts “figure it out”

At scale, that doesn’t work. It turns intelligence into generic data exhaust.

A scalable model must answer: **Relevant to whom?**  
Because the same indicator can be:

- Critical for one organization
- Irrelevant for another
- Dangerous to enforce for a third

---

### 2 Context is missing or inconsistent

An IOC without context is rarely actionable.

                .---------------------.
                |   IOC: 1.2.3.4      |
                '---------------------'
                         |
                         v
                  .-------------.
                  |  CONTEXT?   |
                  '-------------'
                   /     |     \
                  /      |      \
             WHERE?     WHO?   WHEN?
              (geo)   (industry) (time)
                ?        ?        ?

          When context is missing:
          - Safe blocking becomes risky
          - Prioritization collapses
          - Sharing becomes unreliable


Operational decisions require questions like:

- Where was this observed?
- Who was targeted?
- How confident are we?
- What detection source produced it?
- What is its time window (first/last seen)?
- Is it part of a specific campaign?

Most pipelines lose this context either because:

- Feeds don’t provide it
- Tooling strips it
- There’s no standard forcing producers to include it

What remains is an IP/domain/hash floating around as an isolated “fact,” and that’s not enough to drive safe action.

---

### 3 Quality isn’t measurable (so enforcement becomes risky)

Not all IOCs are equal.

Some are high-fidelity artifacts from confirmed intrusions. Others are:

- Opportunistic scans
- Commodity malware noise
- Sandbox artifacts
- Infrastructure that will cause collateral if blocked (CDNs, shared hosting, cloud services)

If your pipeline can’t express *confidence* and *intended use*, you’ll end up either:

- Blocking too aggressively and breaking business, or
- Downgrading everything and missing real threats

---

### 4 Lifecycle is ignored (IOC debt accumulates)

Indicators decay quickly.

             ____________________________
            /                            \
           /   R.I.P.  Useful Signals     \
          |--------------------------------|
          |  stale domains                 |
          |  reassigned IPs                |
          |  expired hashes                |
          |  old campaigns                 |
          |--------------------------------|
          |          IOC  DEBT             |
           \______________________________/

     Add forever + never expire  =>  pipeline rot  =>  trust drops


Infrastructure rotates. Domains get repurposed. IPs change owners. Hashes are replaced. If you treat indicators as “add once, keep forever,” your environment becomes polluted with stale intelligence.

That creates **IOC debt**:

- Old indicators inflate datasets
- Detections drift into irrelevance
- Analysts spend time triaging “ghosts”
- Confidence in the entire system erodes

A scalable approach must treat IOCs as **time-bound knowledge**, not permanent truth.

---

### 5 Distribution becomes fragmented across controls

In many organizations, indicators end up scattered across:

- SIEM watchlists
- EDR custom indicator tables
- Firewall and proxy objects
- SOAR playbooks
- Manual lists shared over email or chat

Fragmentation breaks reliability:

- No single source of truth
- Inconsistent enforcement
- No audit trail of who pushed what and why
- No easy rollback when something causes harm

In practice, this is where “IOC handling” turns into an engineering and governance problem.

---

### 6 Sharing with peers fails for predictable reasons

Even when organizations want to share intrusion intelligence, they hesitate because:

- **Trust:** Who produced the IOC, and how was it validated?
- **Safety:** Could this indicator cause collateral damage?
- **Confidentiality:** Are we leaking sensitive incident details?
- **Reciprocity:** Are we contributing while others consume?
- **Standards:** Will partners tag and describe data consistently?


Without common structure, sharing becomes ad-hoc and political. With no structure, *consuming* peer-shared intelligence is equally risky — because you can’t filter it reliably or apply it safely.

---

## The direction: Collective Defense requires relevance as a first-class concept

The Collective Defense Framework (CDF) starts from a simple premise:

**Intelligence only scales when it can be scoped to the consumer.**

In CDF, relevance is driven by two foundational dimensions:

1. **Geo-region**  
2. **Industry**

These are not perfect, but they’re powerful because they correlate strongly with real targeting patterns:

- Threat actor focus by region
- Language and lure themes
- Regulatory and sector-specific attack surfaces
- Common software stacks and vendors within industries
- Shared third-party ecosystems

When indicators are produced and shared with these relevance markers, organizations can:

- Pull intelligence that matches their exposure profile
- Reduce noise without “going blind”
- Share back in a way that others can safely consume

---

## What Part 1 leaves us with

If we strip the problem down to fundamentals, a scalable IOC system must provide:

- A minimum context model (what every IOC must carry)
- A consistent classification method (so consumers can filter precisely)
- Quality signals (confidence, source, intended use)
- Lifecycle controls (expiry, recency, sightings, deprecation)
- Governed sharing (rules that create trust and safety)

Without these, IOC infrastructure becomes a high-maintenance data pipe that produces low-confidence outputs.

With them, IOC sharing becomes something closer to a *community defense mechanism* than a chaotic feed ecosystem.

---

## Where the series goes next

In Part 2, we’ll move from problem space into a concrete foundation for CDF:

**A minimal, enforceable tagging standard** that makes peer-to-peer IOC sharing workable in practice—without drowning participants in complexity.

Later entries will show how this structure can be operationalized with a collector/disseminator model (in our case, MISP), but the key idea remains the same:

**Collective Defense isn’t “more IOCs.”  
It’s shared intelligence with built-in relevance.**
