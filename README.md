# Australian Cyber Incident Obligation Navigator

A rules-based decision support tool that maps Australian regulatory notification obligations triggered by a cyber incident — across four frameworks simultaneously, ordered by urgency.

Live at [aus-cyber-navigator.vercel.app](https://aus-cyber-navigator.vercel.app)

---

## What it does

When a cyber incident occurs, an Australian organisation may face notification obligations under multiple regulatory frameworks at the same time — each with different triggers, different regulators, and different deadlines. Figuring out which obligations apply to a specific scenario, quickly and under pressure, is harder than it sounds.

This tool takes a described incident scenario as input and runs it through a decision engine that determines every notification obligation that applies — ordered by urgency. It covers four Australian obligation streams:

- **SOCI Act 2018** — 12-hour and 72-hour mandatory reporting to ASD (ACSC) for cyber incidents affecting critical infrastructure assets
- **APRA CPS 234** — 72-hour material incident notification and 10 business day control weakness notification for APRA-regulated entities
- **Privacy Act 1988 — NDB Scheme** — Eligible data breach notification to the OAIC and affected individuals, including a structured serious harm assessment
- **Corporations Act 2001 — Continuous Disclosure** — Immediate market disclosure obligations for ASX-listed entities and AFSL holders

---

## How the engine works

The decision engine is entirely rules-based. Each obligation stream is assessed through encoded if/then logic built directly from primary regulatory sources — the actual legislation, prudential standards, and regulator guidance documents.

Claude API is used only to generate a plain-English summary paragraph after the engine has determined the obligations. The regulatory determinations themselves involve no AI.

This separation is deliberate. Regulatory decisions need to be auditable and defensible. The engine logic can be inspected, tested, and updated independently of any AI component.

---

## Scenario comparison

The tool supports side-by-side scenario comparison. A user can run two different incident scenarios and view the obligation outputs compared across all four streams — with differences highlighted. This is useful for understanding how a change in one variable (sector, incident type, data involved) affects the regulatory picture.

---

## Serious harm assessment

The NDB scheme assessment includes a structured scoring model based on OAIC guidance. Factors assessed include data type sensitivity, encryption status, recipient identity, presence of vulnerable individuals, and ransom payment with attacker assurances.

The engine reflects OAIC's confirmed position (H1 2024 report) that attacker assurances following ransom payment do not reduce the serious harm likelihood determination.

---

## Validation

The engine logic was built from primary sources:

- Security of Critical Infrastructure Act 2018 (Cth) and ASD ACSC guidance
- APRA Prudential Standard CPS 234 Information Security
- Privacy Act 1988 Part IIIC and OAIC NDB scheme guidance including H1 2024 Notifiable Data Breaches Report
- Corporations Act 2001 s.674 and ASX Listing Rule 3.1

The engine has been tested against seven constructed scenarios covering financial services, critical infrastructure, health, general business, and edge cases including ransomware with attacker assurances, insider threats with no external attacker, and BEC incidents with no data breach component.

This tool has not been formally audited or legally reviewed. It is decision support, not legal advice.

---

## Stack

- React (frontend)
- Clerk (Google and GitHub OAuth)
- Supabase (PostgreSQL — scenario history)
- Vercel (hosting and serverless functions)
- Claude API via Vercel serverless function (narrative generation only)

---

## Regulatory currency

Obligation logic reflects the Australian position as at June 2026. Australian cyber legislation and APRA prudential standards are subject to amendment. This tool does not update automatically.

---

## Built by

**Jeshta Rao**
GRC Analyst - ISO/IEC 27001 Lead Auditor
Master of Cybersecurity, RMIT University, Melbourne

[linkedin.com/in/jeshta-rao-3491a6197](https://www.linkedin.com/in/jeshta-rao-3491a6197)

---

## Disclaimer

This tool provides decision support only and does not constitute legal advice. Organisations must engage qualified legal counsel before making any regulatory notification decisions. This tool covers primary federal obligations only and does not cover all state-based obligations, sector-specific variations, or overseas obligations for multinational entities.