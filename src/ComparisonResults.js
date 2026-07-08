const DEADLINE_COLORS = {
  "12 HOURS": { bg: "#8B1A1A22", border: "#8B1A1A", text: "#ff6b6b" },
  "IMMEDIATELY": { bg: "#8B1A1A22", border: "#8B1A1A", text: "#ff6b6b" },
  "72 HOURS": { bg: "#7A4F0022", border: "#7A4F00", text: "#ffaa44" },
  "10 BUSINESS DAYS": { bg: "#1B3A6B22", border: "#2E75B6", text: "#6bb3ff" },
  "30 DAYS": { bg: "#1B3A6B22", border: "#2E75B6", text: "#6bb3ff" },
  "As soon as practicable after determination": { bg: "#1A6B3A22", border: "#1A6B3A", text: "#4dbb7a" },
  "IMMEDIATE": { bg: "#8B1A1A22", border: "#8B1A1A", text: "#ff6b6b" },
};

const STREAMS = [
  { key: "soci", label: "SOCI Act", regulator: "ASD (ACSC)" },
  { key: "cps234", label: "APRA CPS 234", regulator: "APRA" },
  { key: "ndb", label: "Privacy Act - NDB Scheme", regulator: "OAIC" },
  { key: "corporationsAct", label: "Corporations Act", regulator: "ASIC / ASX" },
];

const s = {
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "40px 24px",
  },
  header: {
    marginBottom: "32px",
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
  comparisonGrid: {
    display: "grid",
    gridTemplateColumns: "200px 1fr 1fr",
    gap: "0",
    marginBottom: "24px",
    border: "1px solid #1e3a5f",
    borderRadius: "8px",
    overflow: "hidden",
  },
  colHeader: (color) => ({
    background: color || "#1B3A6B",
    padding: "16px 20px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#fff",
    borderBottom: "1px solid #0d1a27",
  }),
  rowLabel: {
    background: "#0a1520",
    padding: "14px 16px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#8899aa",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
    borderBottom: "1px solid #0d1a27",
    borderRight: "1px solid #1e3a5f",
    display: "flex",
    alignItems: "center",
  },
  cell: (highlight, i) => ({
    background: highlight ? "#2E75B611" : i % 2 === 0 ? "#111e2d" : "#0f1923",
    padding: "14px 16px",
    fontSize: "13px",
    color: highlight ? "#2E75B6" : "#ccd6e0",
    borderBottom: "1px solid #0d1a27",
    borderRight: "1px solid #1e3a5f",
    display: "flex",
    alignItems: "center",
  }),
  diffBadge: {
    display: "inline-block",
    padding: "2px 8px",
    background: "#7A4F0022",
    border: "1px solid #7A4F00",
    borderRadius: "4px",
    fontSize: "10px",
    color: "#ffaa44",
    marginLeft: "8px",
    fontWeight: "600",
  },
  streamRow: (applicable) => ({
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }),
  triggeredBadge: (applicable) => ({
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "700",
    background: applicable ? "#1A6B3A22" : "#8B1A1A22",
    border: `1px solid ${applicable ? "#1A6B3A" : "#8B1A1A"}`,
    color: applicable ? "#4dbb7a" : "#ff6b6b",
  }),
  deadlineBadge: (deadline) => {
    if (!deadline) return { fontSize: "12px", color: "#556677" };
    const c = DEADLINE_COLORS[deadline] || DEADLINE_COLORS["72 HOURS"];
    return {
      display: "inline-block",
      background: c.bg,
      border: `1px solid ${c.border}`,
      color: c.text,
      borderRadius: "4px",
      padding: "3px 8px",
      fontSize: "11px",
      fontWeight: "700",
    };
  },
  narrativeGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "24px",
  },
  narrativeCard: {
    background: "#111e2d",
    border: "1px solid #2E75B6",
    borderRadius: "8px",
    padding: "20px",
  },
  narrativeLabel: {
    fontSize: "10px",
    color: "#2E75B6",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    marginBottom: "10px",
  },
  narrativeText: {
    fontSize: "13px",
    color: "#ccd6e0",
    lineHeight: "1.8",
  },
  btnRow: {
    display: "flex",
    gap: "12px",
    marginTop: "24px",
    paddingBottom: "48px",
    flexWrap: "wrap",
  },
  exportBtn: {
    padding: "12px 28px",
    background: "#1A6B3A",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  changeBtn: {
    padding: "12px 28px",
    background: "#2E75B622",
    color: "#2E75B6",
    border: "1px solid #2E75B6",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  newBtn: {
    padding: "12px 28px",
    background: "transparent",
    color: "#8899aa",
    border: "1px solid #1e3a5f",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer",
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
    marginTop: "32px",
  },
};

function formatSector(sector) {
  if (!sector) return "Unknown";
  return sector.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function formatIncident(type) {
  if (!type) return "Unknown";
  const map = {
    ransomware: "Ransomware",
    data_breach: "Data Breach",
    bec: "Business Email Compromise",
    insider_threat: "Insider Threat",
    ddos: "DDoS",
    supply_chain: "Supply Chain",
    other: "Other",
  };
  return map[type] || type;
}

export default function ComparisonResults({
  slotA,
  slotB,
  hasComparedOnce,
  onChangeA,
  onChangeB,
  onReset,
}) {
  const sectorA = slotA.inputs
    ? `${formatSector(slotA.inputs.sector)} / ${formatIncident(slotA.inputs.incidentType)}`
    : "Scenario A";
  const sectorB = slotB.inputs
    ? `${formatSector(slotB.inputs.sector)} / ${formatIncident(slotB.inputs.incidentType)}`
    : "Scenario B";

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div style={s.title}>Scenario Comparison</div>
        <div style={s.subtitle}>
          Differences are highlighted in amber. Scroll down for detailed obligation breakdown per scenario.
        </div>
      </div>

      {/* Summary comparison grid */}
      <div style={s.comparisonGrid}>

        {/* Header row */}
        <div style={s.colHeader("#0a1520")} />
        <div style={s.colHeader("#1B3A6B")}>
          Scenario A
          <div style={{ fontSize: "11px", color: "#8899aa", fontWeight: "400", marginTop: "2px" }}>{sectorA}</div>
        </div>
        <div style={s.colHeader("#0d2a4a")}>
          Scenario B
          <div style={{ fontSize: "11px", color: "#8899aa", fontWeight: "400", marginTop: "2px" }}>{sectorB}</div>
        </div>

        {/* Streams triggered */}
        <div style={s.rowLabel}>Streams Triggered</div>
        <div style={s.cell(false, 0)}>
          <span style={{ fontSize: "20px", fontWeight: "700", color: slotA.results.summary.totalStreamsTriggered > 0 ? "#ff6b6b" : "#4dbb7a" }}>
            {slotA.results.summary.totalStreamsTriggered} / 4
          </span>
        </div>
        <div style={s.cell(false, 0)}>
          <span style={{ fontSize: "20px", fontWeight: "700", color: slotB.results.summary.totalStreamsTriggered > 0 ? "#ff6b6b" : "#4dbb7a" }}>
            {slotB.results.summary.totalStreamsTriggered} / 4
          </span>
        </div>

        {/* Most urgent deadline */}
        <div style={s.rowLabel}>Most Urgent Deadline</div>
        <div style={s.cell(slotA.results.summary.mostUrgentDeadline?.deadline !== slotB.results.summary.mostUrgentDeadline?.deadline, 1)}>
          <span style={s.deadlineBadge(slotA.results.summary.mostUrgentDeadline?.deadline)}>
            {slotA.results.summary.mostUrgentDeadline?.deadline || "None"}
          </span>
          {slotA.results.summary.mostUrgentDeadline?.deadline !== slotB.results.summary.mostUrgentDeadline?.deadline && (
            <span style={s.diffBadge}>DIFFERS</span>
          )}
        </div>
        <div style={s.cell(slotA.results.summary.mostUrgentDeadline?.deadline !== slotB.results.summary.mostUrgentDeadline?.deadline, 1)}>
          <span style={s.deadlineBadge(slotB.results.summary.mostUrgentDeadline?.deadline)}>
            {slotB.results.summary.mostUrgentDeadline?.deadline || "None"}
          </span>
        </div>

        {/* Lead regulator */}
        <div style={s.rowLabel}>Lead Regulator</div>
        <div style={s.cell(false, 2)}>
          <span style={{ fontSize: "13px" }}>{slotA.results.summary.mostUrgentDeadline?.regulator || "N/A"}</span>
        </div>
        <div style={s.cell(false, 2)}>
          <span style={{ fontSize: "13px" }}>{slotB.results.summary.mostUrgentDeadline?.regulator || "N/A"}</span>
        </div>

        {/* Per stream rows */}
        {STREAMS.map((stream, i) => {
          const sA = slotA.results.streams[stream.key];
          const sB = slotB.results.streams[stream.key];
          const isDiff = sA.applicable !== sB.applicable || sA.deadline !== sB.deadline;
          return [
            <div key={`label-${i}`} style={{ ...s.rowLabel, background: isDiff ? "#7A4F0011" : "#0a1520" }}>
              {stream.label}
              {isDiff && <span style={{ ...s.diffBadge, marginLeft: "6px" }}>DIFFERS</span>}
            </div>,
            <div key={`a-${i}`} style={s.cell(isDiff, i + 3)}>
              <span style={s.triggeredBadge(sA.applicable)}>
                {sA.applicable ? "TRIGGERED" : "NOT TRIGGERED"}
              </span>
              {sA.applicable && sA.deadline && (
                <span style={{ ...s.deadlineBadge(sA.deadline), marginLeft: "8px" }}>{sA.deadline}</span>
              )}
            </div>,
            <div key={`b-${i}`} style={s.cell(isDiff, i + 3)}>
              <span style={s.triggeredBadge(sB.applicable)}>
                {sB.applicable ? "TRIGGERED" : "NOT TRIGGERED"}
              </span>
              {sB.applicable && sB.deadline && (
                <span style={{ ...s.deadlineBadge(sB.deadline), marginLeft: "8px" }}>{sB.deadline}</span>
              )}
            </div>,
          ];
        })}
      </div>

      {/* Narratives */}
      {(slotA.narrative || slotB.narrative) && (
        <>
          <div style={s.sectionTitle}>Plain-English Summaries - Generated by Claude</div>
          <div style={s.narrativeGrid}>
            <div style={s.narrativeCard}>
              <div style={s.narrativeLabel}>Scenario A - {sectorA}</div>
              <div style={s.narrativeText}>{slotA.narrative || "Not available"}</div>
            </div>
            <div style={s.narrativeCard}>
              <div style={s.narrativeLabel}>Scenario B - {sectorB}</div>
              <div style={s.narrativeText}>{slotB.narrative || "Not available"}</div>
            </div>
          </div>
        </>
      )}

      {/* Disclaimer */}
      <div style={{ padding: "16px", background: "#0a1520", borderRadius: "6px", fontSize: "11px", color: "#556677", lineHeight: "1.7", borderLeft: "3px solid #1e3a5f" }}>
        <strong style={{ color: "#8899aa" }}>Disclaimer:</strong> This tool provides decision support only and does not constitute legal advice.
        Regulatory obligations reflect the Australian position as at June 2026.
        Seek legal counsel before making final notification decisions.
      </div>

      {/* Buttons */}
      <div style={s.btnRow}>
        <button style={s.exportBtn} onClick={() => window.print()}>
          Download as PDF
        </button>
        {hasComparedOnce && (
          <button style={s.changeBtn} onClick={onChangeA}>
            Change Scenario A
          </button>
        )}
        <button style={s.changeBtn} onClick={onChangeB}>
          Change Scenario B
        </button>
        <button style={s.newBtn} onClick={onReset}>
          Run New Scenario
        </button>
      </div>
    </div>
  );
}