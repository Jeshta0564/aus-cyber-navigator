// ============================================================
// AUSTRALIAN CYBER INCIDENT OBLIGATION NAVIGATOR
// Decision Engine v1.0
// Author: Jeshta Rao | RMIT University | June 2026
//
// This module encodes the regulatory logic for four Australian
// cyber incident notification obligation streams.
// Claude API is NOT used here -- all logic is rules-based.
// ============================================================

// ── STREAM 1: SOCI ACT ──────────────────────────────────────
function assessSOCI(inputs) {
  const result = {
    stream: "SOCI Act",
    regulator: "ASD (ACSC)",
    applicable: false,
    tier: null,
    deadline: null,
    obligations: [],
    reasoning: []
  };

  if (!inputs.isResponsibleEntity) {
    result.reasoning.push("Organisation is not a Responsible Entity under the SOCI Act.");
    return result;
  }

  if (!inputs.cyberIncidentOccurred) {
    result.reasoning.push("No cyber incident affecting a CI asset has been identified.");
    return result;
  }

  result.applicable = true;

  if (inputs.significantAvailabilityImpact) {
    result.tier = "TIER 1";
    result.deadline = "12 HOURS";
    result.obligations.push({
      action: "Notify ASD (ACSC)",
      deadline: "Within 12 hours of becoming aware",
      method: "ACSC portal (cyber.gov.au) or call 1300 CYBER1",
      content: [
        "Date and time the incident was detected",
        "Nature of the incident",
        "Systems and assets affected",
        "Description of the availability impact",
        "Steps taken so far"
      ],
      note: "Verbal notification acceptable initially. Written record must be completed within 84 hours."
    });
    result.reasoning.push("Significant impact on availability of a CI asset confirmed. Tier 1 -- 12-hour notification triggered.");
  } else if (inputs.relevantImpact) {
    result.tier = "TIER 2";
    result.deadline = "72 HOURS";
    result.obligations.push({
      action: "Notify ASD (ACSC)",
      deadline: "Within 72 hours of becoming aware",
      method: "ACSC portal (cyber.gov.au) or call 1300 CYBER1",
      content: [
        "Date and time the incident was detected",
        "Nature of the incident",
        "Systems and assets affected",
        "Description of impact on integrity, reliability, or confidentiality",
        "Steps taken so far"
      ],
      note: "Written record must be completed within 84 hours if initial notification was verbal."
    });
    result.reasoning.push("Relevant impact on integrity, reliability, or confidentiality of a CI asset confirmed. Tier 2 -- 72-hour notification triggered.");
  } else {
    result.applicable = false;
    result.reasoning.push("Incident does not meet Tier 1 or Tier 2 impact thresholds. No mandatory SOCI notification required. Document your assessment.");
  }

  result.obligations.push({
    action: "LIMITED USE REMINDER",
    deadline: "Immediate",
    method: "Internal legal counsel",
    content: [
      "Voluntary reports to ASD carry the Limited Use Obligation -- cannot be used for regulatory purposes by APRA, OAIC, or ASIC",
      "Mandatory SOCI notifications do NOT carry this protection",
      "Keep voluntary and mandatory communications separate",
      "Seek legal advice on how to structure communications with ASD"
    ],
    note: "Critical distinction -- consult legal counsel immediately."
  });

  return result;
}

// ── STREAM 2: APRA CPS 234 ───────────────────────────────────
function assessCPS234(inputs) {
  const result = {
    stream: "APRA CPS 234",
    regulator: "APRA",
    applicable: false,
    tier: null,
    deadline: null,
    obligations: [],
    reasoning: []
  };

  if (!inputs.isAPRARegulated) {
    result.reasoning.push("Organisation is not APRA-regulated. CPS 234 does not apply.");
    return result;
  }

  result.applicable = true;

  if (inputs.materialIncident) {
    result.deadline = "72 HOURS";
    result.obligations.push({
      action: "Notify APRA -- Material Incident",
      deadline: "As soon as possible, no later than 72 hours from awareness",
      method: "APRA Secure Stakeholder Portal (SSP)",
      content: [
        "Nature of the incident",
        "Date and time the incident was detected",
        "Systems and information assets affected",
        "Preliminary impact assessment",
        "Steps taken and planned remediation"
      ],
      note: "Follow-up reports required as investigation develops. APRA prefers over-notification to missed notifications."
    });
    result.reasoning.push("Material information security incident confirmed -- materially affects financial interests or ability to manage information assets. 72-hour APRA notification triggered.");
  }

  if (inputs.controlWeaknessIdentified) {
    result.obligations.push({
      action: "Notify APRA -- Control Weakness",
      deadline: "Within 10 business days of becoming aware",
      method: "APRA Secure Stakeholder Portal (SSP)",
      content: [
        "Nature of the control weakness",
        "Systems or controls affected",
        "Remediation plan and expected timeline",
        "Whether the weakness was exploited in this incident"
      ],
      note: "This is a separate obligation from the incident notification. Both may apply simultaneously."
    });
    result.reasoning.push("Material control weakness identified during investigation. Separate 10 business day notification to APRA triggered.");
  }

  if (inputs.criticalOperationsDisrupted) {
    result.obligations.push({
      action: "CPS 230 -- Board Notification",
      deadline: "Immediate -- when BCP is activated",
      method: "Internal board notification process",
      content: [
        "Nature of the operational disruption",
        "Critical operations affected",
        "BCP activation status",
        "Expected recovery timeline"
      ],
      note: "CPS 230 obligations run alongside CPS 234. Document separately."
    });
    result.reasoning.push("Critical operations disrupted. CPS 230 board notification obligation triggered alongside CPS 234.");
  }

  if (!inputs.materialIncident && !inputs.controlWeaknessIdentified) {
    result.applicable = false;
    result.reasoning.push("Incident does not appear to meet the materiality threshold for CPS 234 notification. Document your assessment. Monitor as investigation develops.");
  }

  return result;
}

// ── STREAM 3: PRIVACY ACT NDB SCHEME ────────────────────────
function assessNDB(inputs) {
  const result = {
    stream: "Privacy Act -- NDB Scheme",
    regulator: "OAIC",
    applicable: false,
    tier: null,
    deadline: null,
    obligations: [],
    reasoning: [],
    seriousHarmAssessment: null
  };

  if (!inputs.personalInformationInvolved) {
    result.reasoning.push("No personal information involved. NDB scheme does not apply.");
    return result;
  }

  // Condition 1
  if (!inputs.unauthorisedAccessOrDisclosure) {
    result.reasoning.push("Condition 1 not met -- no unauthorised access, disclosure, or loss of personal information identified.");
    return result;
  }
  result.reasoning.push("Condition 1 met -- unauthorised access or disclosure of personal information confirmed.");

  // Condition 2
  result.reasoning.push("Condition 2 met -- personal information is of a kind the entity is required to protect under the Privacy Act.");

  // Condition 3 -- Serious Harm Assessment
  const harmScore = calculateSeriousHarm(inputs);
  result.seriousHarmAssessment = harmScore;

  if (harmScore.likely) {
    result.applicable = true;
    result.deadline = "As soon as practicable after determination";
    result.reasoning.push(`Condition 3 met -- serious harm likely. Factors: ${harmScore.factors.join(", ")}.`);

    result.obligations.push({
      action: "Notify OAIC",
      deadline: "As soon as practicable after determining an eligible data breach has occurred",
      method: "OAIC NDB notification form at oaic.gov.au",
      content: [
        "Entity name and contact details",
        "Description of the data breach",
        "Kinds of personal information involved",
        "Number of individuals affected (if known)",
        "Recommended steps for affected individuals"
      ],
      note: "Assessment must be completed within 30 days of first suspecting an eligible data breach."
    });

    result.obligations.push({
      action: "Notify Affected Individuals",
      deadline: "As soon as practicable after determining an eligible data breach",
      method: "Direct notification to each affected individual",
      content: [
        "Description of the breach",
        "Kinds of personal information involved",
        "Steps the individual should take to protect themselves",
        "Entity contact details for further information"
      ],
      note: "Direct notification required unless impracticable -- in which case OAIC may approve substitute notification (e.g. website notice)."
    });
  } else if (harmScore.borderline) {
    result.applicable = true;
    result.deadline = "Assessment required within 30 days";
    result.reasoning.push(`Condition 3 is borderline -- serious harm assessment inconclusive. Factors: ${harmScore.factors.join(", ")}. Seek legal advice.`);
    result.obligations.push({
      action: "Complete Serious Harm Assessment",
      deadline: "Within 30 days of first suspecting an eligible data breach",
      method: "Internal assessment with legal counsel",
      content: [
        "Document the serious harm assessment methodology",
        "Record all factors considered",
        "Obtain legal advice on the threshold determination",
        "If serious harm confirmed -- notify OAIC and individuals immediately"
      ],
      note: "When in doubt, notify. The cost of an unnecessary notification is lower than the cost of a missed mandatory notification."
    });
  } else {
    result.reasoning.push(`Condition 3 not met -- serious harm not likely based on available information. Factors assessed: ${harmScore.factors.join(", ")}. Document your assessment and retain records.`);
  }

  // Ransom assurance warning
  if (inputs.ransomPaidWithAssurances) {
    result.obligations.push({
      action: "CRITICAL WARNING -- Ransom Assurances",
      deadline: "Immediate",
      method: "Legal counsel",
      content: [
        "Attacker assurances that data will be deleted are NOT sufficient to conclude serious harm is not likely",
        "OAIC confirmed this position in its H1 2024 report",
        "Do not factor attacker assurances into your Condition 3 assessment as a mitigating factor",
        "Proceed with serious harm assessment as if data remains in attacker hands"
      ],
      note: "This is OAIC's confirmed regulatory position. Non-compliance with this is a significant risk."
    });
    result.reasoning.push("CRITICAL: Ransom paid with attacker assurances. Per OAIC H1 2024 guidance, these assurances do not reduce serious harm likelihood.");
  }

  return result;
}

// ── SERIOUS HARM CALCULATOR ──────────────────────────────────
function calculateSeriousHarm(inputs) {
  const factors = [];
  let riskScore = 0;

  // Data sensitivity
  if (inputs.dataTypes.includes("health")) {
    riskScore += 3;
    factors.push("Health/medical information involved -- high sensitivity");
  }
  if (inputs.dataTypes.includes("financial")) {
    riskScore += 3;
    factors.push("Financial/account information involved -- high sensitivity");
  }
  if (inputs.dataTypes.includes("government_id")) {
    riskScore += 3;
    factors.push("Government identifiers (TFN, Medicare) involved -- high sensitivity");
  }
  if (inputs.dataTypes.includes("location")) {
    riskScore += 3;
    factors.push("Location data involved -- potential physical safety risk");
  }
  if (inputs.dataTypes.includes("credentials")) {
    riskScore += 2;
    factors.push("Login credentials involved -- identity theft risk");
  }
  if (inputs.dataTypes.includes("name_email_only")) {
    riskScore += 1;
    factors.push("Name and email only -- lower sensitivity but assess further");
  }

  // Encryption status
  if (!inputs.dataEncrypted) {
    riskScore += 2;
    factors.push("Data was not encrypted -- attacker can access it");
  } else {
    riskScore -= 1;
    factors.push("Data was encrypted -- reduces but does not eliminate harm likelihood");
  }

  // Recipient
  if (inputs.recipientType === "criminal") {
    riskScore += 3;
    factors.push("Data obtained by criminal attacker -- high harm likelihood");
  } else if (inputs.recipientType === "unknown") {
    riskScore += 2;
    factors.push("Recipient unknown -- cannot rule out malicious use");
  } else if (inputs.recipientType === "accidental_trusted") {
    riskScore += 0;
    factors.push("Accidental disclosure to trusted party -- lower harm likelihood");
  }

  // Vulnerable individuals
  if (inputs.vulnerableIndividuals) {
    riskScore += 2;
    factors.push("Vulnerable individuals affected (children, DV victims, elderly) -- elevated risk");
  }

  // Ransom assurances -- explicitly do NOT reduce score per OAIC guidance
  if (inputs.ransomPaidWithAssurances) {
    factors.push("Ransom paid with attacker assurances -- per OAIC guidance these do NOT reduce harm likelihood");
  }

  return {
    score: riskScore,
    likely: riskScore >= 6,
    borderline: riskScore >= 3 && riskScore < 6,
    factors
  };
}

// ── STREAM 4: CORPORATIONS ACT ───────────────────────────────
function assessCorporationsAct(inputs) {
  const result = {
    stream: "Corporations Act -- Continuous Disclosure",
    regulator: "ASIC / ASX",
    applicable: false,
    tier: null,
    deadline: null,
    obligations: [],
    reasoning: []
  };

  if (!inputs.isASXListed && !inputs.isAFSLHolder) {
    result.reasoning.push("Organisation is not ASX-listed and does not hold an AFSL. Corporations Act continuous disclosure does not apply.");
    return result;
  }

  result.applicable = true;

  if (inputs.materialToMarket) {
    result.deadline = "IMMEDIATELY";
    result.obligations.push({
      action: "Notify ASX -- Market Announcement",
      deadline: "Immediately upon materiality determination",
      method: "ASX Online -- lodge market announcement",
      content: [
        "Nature of the cyber incident",
        "Potential impact on operations and financial performance",
        "Steps being taken to respond",
        "Any known or estimated financial impact",
        "Ongoing monitoring and update commitments"
      ],
      note: "Legal counsel determines the content scope. Technical details are not required -- investor-relevant impact is. This obligation may fire BEFORE APRA or ASD notifications are complete."
    });
    result.reasoning.push("Incident is likely to materially affect share price or investor decisions. Immediate ASX notification required. Legal counsel must lead this determination.");
  } else {
    result.reasoning.push("Materiality to market is uncertain. Legal counsel must monitor as the incident develops. Materiality determination can change as more information becomes available.");
    result.obligations.push({
      action: "Legal Counsel -- Materiality Monitoring",
      deadline: "Ongoing from incident awareness",
      method: "Internal -- legal and CFO",
      content: [
        "Monitor revenue and operational impact as incident develops",
        "Reassess materiality determination as new information emerges",
        "Document all materiality assessments and rationale",
        "Be ready to lodge ASX announcement immediately if materiality threshold is crossed"
      ],
      note: "Delayed disclosure after materiality is established is itself a compliance breach."
    });
  }

  return result;
}

// ── MASTER ENGINE ────────────────────────────────────────────
export function runObligationEngine(inputs) {
  const results = {
    scenario: inputs,
    timestamp: new Date().toISOString(),
    streams: {
      soci: assessSOCI(inputs),
      cps234: assessCPS234(inputs),
      ndb: assessNDB(inputs),
      corporationsAct: assessCorporationsAct(inputs)
    },
    summary: {}
  };

  // Build summary
  const activeStreams = Object.values(results.streams).filter(s => s.applicable);
  const allDeadlines = activeStreams
    .filter(s => s.deadline)
    .map(s => ({ stream: s.stream, regulator: s.regulator, deadline: s.deadline }));

  // Sort by urgency
  const urgencyOrder = ["12 HOURS", "IMMEDIATELY", "72 HOURS", "10 BUSINESS DAYS", "30 DAYS", "As soon as practicable after determination"];
  allDeadlines.sort((a, b) => {
    const ai = urgencyOrder.indexOf(a.deadline);
    const bi = urgencyOrder.indexOf(b.deadline);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  results.summary = {
    totalStreamsTriggered: activeStreams.length,
    mostUrgentDeadline: allDeadlines[0] || null,
    deadlinesByUrgency: allDeadlines,
    activeStreamNames: activeStreams.map(s => s.stream)
  };

  return results;
}