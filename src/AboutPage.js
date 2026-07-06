const s = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "40px 24px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "40px",
  },
  title: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "4px",
  },
  subtitle: {
    fontSize: "12px",
    color: "#556677",
  },
  backBtn: {
    padding: "10px 20px",
    background: "transparent",
    color: "#8899aa",
    border: "1px solid #1e3a5f",
    borderRadius: "6px",
    fontSize: "13px",
    cursor: "pointer",
  },
  section: {
    background: "#111e2d",
    border: "1px solid #1e3a5f",
    borderRadius: "8px",
    padding: "28px",
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#2E75B6",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    marginBottom: "16px",
    paddingBottom: "8px",
    borderBottom: "1px solid #1e3a5f",
  },
  para: {
    fontSize: "13px",
    color: "#8899aa",
    lineHeight: "1.8",
    marginBottom: "12px",
  },
  highlight: {
    color: "#ccd6e0",
    fontWeight: "500",
  },
  frameworkGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginTop: "8px",
  },
  frameworkCard: {
    background: "#0a1520",
    border: "1px solid #1e3a5f",
    borderRadius: "6px",
    padding: "14px 16px",
  },
  frameworkName: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#2E75B6",
    marginBottom: "4px",
  },
  frameworkDesc: {
    fontSize: "12px",
    color: "#556677",
    lineHeight: "1.6",
  },
  limitationItem: {
    display: "flex",
    gap: "12px",
    marginBottom: "12px",
    alignItems: "flex-start",
  },
  limitationDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#2E75B6",
    marginTop: "6px",
    flexShrink: 0,
  },
  limitationText: {
    fontSize: "13px",
    color: "#8899aa",
    lineHeight: "1.7",
  },
  versionBadge: {
    display: "inline-block",
    padding: "4px 12px",
    background: "#1B3A6B22",
    border: "1px solid #2E75B6",
    borderRadius: "4px",
    fontSize: "11px",
    color: "#2E75B6",
    marginBottom: "16px",
    fontWeight: "600",
  },
  builderCard: {
    background: "#0a1520",
    border: "1px solid #2E75B6",
    borderRadius: "8px",
    padding: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
  },
  builderName: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "4px",
  },
  builderDetails: {
    fontSize: "12px",
    color: "#556677",
    lineHeight: "1.7",
  },
  linkedinBtn: {
    padding: "10px 20px",
    background: "#0A66C2",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-block",
  },
  warningBox: {
    background: "#7A4F0011",
    border: "1px solid #7A4F00",
    borderRadius: "6px",
    padding: "14px 16px",
    fontSize: "12px",
    color: "#ffaa44",
    lineHeight: "1.7",
    marginTop: "16px",
  },
};

const frameworks = [
  {
    name: "SOCI Act 2018",
    desc: "12-hour and 72-hour mandatory reporting to ASD for cyber incidents affecting critical infrastructure assets. Source: Security of Critical Infrastructure Act 2018 (Cth) and ASD ACSC guidance.",
  },
  {
    name: "APRA CPS 234",
    desc: "72-hour material incident notification and 10 business day control weakness notification for APRA-regulated entities. Source: Prudential Standard CPS 234 Information Security.",
  },
  {
    name: "Privacy Act - NDB Scheme",
    desc: "Eligible data breach notification to OAIC and affected individuals. Three-condition test including serious harm assessment. Source: Privacy Act 1988 Part IIIC and OAIC guidance including H1 2024 report.",
  },
  {
    name: "Corporations Act 2001",
    desc: "Immediate continuous disclosure obligations for ASX-listed entities and AFSL holders where an incident may materially affect share price. Source: Corporations Act s.674 and ASX Listing Rule 3.1.",
  },
];

const limitations = [
  ["Decision support only", "This tool does not constitute legal advice. Organisations must engage qualified legal counsel before making any regulatory notification decisions."],
  ["Federal obligations only", "This tool covers primary federal notification obligations. It does not cover state-based privacy obligations, sector-specific reporting to state regulators, or overseas obligations for multinational entities."],
  ["Serious harm is a judgement call", "The NDB scheme's serious harm threshold involves subjective legal judgment. The engine applies OAIC guidance as at June 2026 but cannot replace legal advice on threshold determinations."],
  ["Regulatory currency", "Australian cyber legislation changes. This tool reflects the June 2026 position and does not update automatically. Verify current obligations before relying on outputs."],
  ["APRA notifications require direct contact", "This tool maps APRA notification obligations but does not facilitate the notification itself. APRA requires direct communication through its Secure Stakeholder Portal."],
];

export default function AboutPage({ onBack }) {
  return (
    <div style={s.container}>

      <div style={s.header}>
        <div>
          <div style={s.title}>About This Tool</div>
          <div style={s.subtitle}>What it is, how it works, and what it does not do</div>
        </div>
        <button style={s.backBtn} onClick={onBack}>- Back</button>
      </div>

      <div style={s.section}>
        <div style={s.sectionTitle}>Version and Currency</div>
        <div style={s.versionBadge}>Version 1.0 - June 2026</div>
        <p style={s.para}>
          The regulatory logic in this tool reflects the Australian position as at <span style={s.highlight}>June 2026</span>. Australian cyber legislation, APRA prudential standards, and OAIC guidance are subject to amendment. Users should verify that the obligations surfaced by this tool remain current before acting on them.
        </p>
        <p style={s.para}>
          Key regulatory developments reflected in this version include: the SOCI Act 2021 and 2022 amendments, APRA CPS 234 (effective July 2019), APRA CPS 230 (effective July 2025), the Privacy Act NDB scheme, and APRA's April 2026 letter on AI governance failures in regulated entities.
        </p>
      </div>

      <div style={s.section}>
        <div style={s.sectionTitle}>What This Tool Does</div>
        <p style={s.para}>
          The Australian Cyber Incident Obligation Navigator is a <span style={s.highlight}>rules-based decision support tool</span>. When you describe a cyber incident scenario, a decision engine encodes the regulatory logic across four Australian obligation streams and surfaces every notification obligation that applies to your situation - ordered by urgency.
        </p>
        <p style={s.para}>
          The engine determines which obligations apply. It does not use AI to make regulatory judgements. Claude is used only to generate the plain-English summary paragraph at the end - the obligation outputs themselves are determined by encoded if/then logic built from primary regulatory sources.
        </p>
      </div>

      <div style={s.section}>
        <div style={s.sectionTitle}>Frameworks and Sources Covered</div>
        <p style={s.para}>
          The decision engine covers four Australian notification obligation streams. Each stream's logic is built directly from the primary source documents listed below.
        </p>
        <div style={s.frameworkGrid}>
          {frameworks.map((f, i) => (
            <div key={i} style={s.frameworkCard}>
              <div style={s.frameworkName}>{f.name}</div>
              <div style={s.frameworkDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={s.section}>
        <div style={s.sectionTitle}>How the Engine Logic Was Validated</div>
        <p style={s.para}>
          The decision engine logic was built directly from primary regulatory sources - the actual legislation, prudential standards, and regulator guidance documents - rather than summaries or third-party interpretations. Each obligation trigger, threshold, and timeline was mapped against the source document before being encoded.
        </p>
        <p style={s.para}>
          The engine has been tested against seven constructed scenarios covering financial services, critical infrastructure, health, general business, and edge cases including ransomware with attacker assurances, insider threats with no external attacker, and BEC incidents with no data breach component.
        </p>
        <div style={s.warningBox}>
          This tool has not been formally audited or legally reviewed. It is decision support, not legal advice. All obligation outputs should be verified with qualified legal counsel before acting on them.
        </div>
      </div>

      <div style={s.section}>
        <div style={s.sectionTitle}>Limitations</div>
        {limitations.map(([title, text], i) => (
          <div key={i} style={s.limitationItem}>
            <div style={s.limitationDot} />
            <div style={s.limitationText}>
              <span style={s.highlight}>{title} - </span>{text}
            </div>
          </div>
        ))}
      </div>

      <div style={s.section}>
        <div style={s.sectionTitle}>Built By</div>
        <div style={s.builderCard}>
          <div>
            <div style={s.builderName}>Jeshta Rao</div>
            <div style={s.builderDetails}>
              Master of Cybersecurity · RMIT University, Melbourne<br />
              ISO/IEC 27001 Lead Auditor<br />
              GRC Experience · Bosch Automotive · June 2026
            </div>
          </div>
          <a
            href="https://www.linkedin.com/in/jeshta-rao"
            target="_blank"
            rel="noreferrer"
            style={s.linkedinBtn}
          >
            LinkedIn
          </a>
        </div>
      </div>

    </div>
  );
}