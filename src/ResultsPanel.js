const DEADLINE_COLORS = {
  "12 HOURS": { bg: "#8B1A1A22", border: "#8B1A1A", text: "#ff6b6b" },
  "IMMEDIATELY": { bg: "#8B1A1A22", border: "#8B1A1A", text: "#ff6b6b" },
  "72 HOURS": { bg: "#7A4F0022", border: "#7A4F00", text: "#ffaa44" },
  "10 BUSINESS DAYS": { bg: "#1B3A6B22", border: "#2E75B6", text: "#6bb3ff" },
  "30 DAYS": { bg: "#1B3A6B22", border: "#2E75B6", text: "#6bb3ff" },
  "As soon as practicable after determination": { bg: "#1A6B3A22", border: "#1A6B3A", text: "#4dbb7a" },
  "Assessment required within 30 days": { bg: "#1B3A6B22", border: "#2E75B6", text: "#6bb3ff" },
  "IMMEDIATE": { bg: "#8B1A1A22", border: "#8B1A1A", text: "#ff6b6b" },
};

const s = {
  container: { maxWidth: "900px", margin: "0 auto", padding: "40px 24px" },
  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" },
  metricCard: { background: "#111e2d", border: "1px solid #1e3a5f", borderRadius: "8px", padding: "20px", textAlign: "center" },
  metricLabel: { fontSize: "11px", color: "#556677", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "8px" },
  metricValue: { fontSize: "28px", fontWeight: "700", color: "#fff" },
  metricSub: { fontSize: "11px", color: "#8899aa", marginTop: "4px" },
  sectionTitle: { fontSize: "11px", fontWeight: "600", color: "#2E75B6", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "16px", paddingBottom: "8px", borderBottom: "1px solid #1e3a5f" },
  card: { background: "#111e2d", border: "1px solid #1e3a5f", borderRadius: "8px", padding: "24px", marginBottom: "24px" },
  timelineRow: { display: "flex", alignItems: "center", gap: "16px", padding: "12px 0", borderBottom: "1px solid #0d1a27" },
  deadlineBadge: (deadline) => {
    const c = DEADLINE_COLORS[deadline] || DEADLINE_COLORS["72 HOURS"];
    return { background: c.bg, border: `1px solid ${c.border}`, color: c.text, borderRadius: "4px", padding: "4px 10px", fontSize: "11px", fontWeight: "700", whiteSpace: "nowrap", minWidth: "120px", textAlign: "center" };
  },
  streamCard: (applicable) => ({ background: applicable ? "#111e2d" : "#0a1520", border: `1px solid ${applicable ? "#1e3a5f" : "#0d1a27"}`, borderRadius: "8px", padding: "24px", marginBottom: "16px", opacity: applicable ? 1 : 0.5 }),
  statusBadge: (applicable) => ({ padding: "4px 12px", borderRadius: "4px", fontSize: "11px", fontWeight: "700", background: applicable ? "#1A6B3A22" : "#8B1A1A22", border: `1px solid ${applicable ? "#1A6B3A" : "#8B1A1A"}`, color: applicable ? "#4dbb7a" : "#ff6b6b" }),
  obligationBlock: { background: "#0a1520", border: "1px solid #1e3a5f", borderRadius: "6px", padding: "16px", marginBottom: "12px" },
  obligationAction: { fontSize: "13px", fontWeight: "600", color: "#2E75B6", marginBottom: "8px" },
  obligationRow: { display: "flex", gap: "8px", marginBottom: "6px", fontSize: "12px" },
  obligationKey: { color: "#556677", minWidth: "70px", flexShrink: 0 },
  obligationVal: { color: "#ccd6e0" },
  contentList: { margin: "6px 0 0 0", padding: "0 0 0 16px", fontSize: "12px", color: "#8899aa", lineHeight: "1.8" },
  reasoningBlock: { marginTop: "12px", padding: "12px", background: "#0f1923", borderRadius: "6px", borderLeft: "3px solid #2E75B6" },
  narrativeCard: { background: "#111e2d", border: "1px solid #2E75B6", borderRadius: "8px", padding: "24px", marginBottom: "24px" },
  exportBtn: { padding: "12px 28px", background: "#1A6B3A", color: "#fff", border: "none", borderRadius: "6px", fontSize: "14px", fontWeight: "600", cursor: "pointer" },
  compareBtn: { padding: "12px 28px", background: "#2E75B622", color: "#2E75B6", border: "1px solid #2E75B6", borderRadius: "6px", fontSize: "14px", fontWeight: "600", cursor: "pointer" },
  newBtn: { padding: "12px 28px", background: "transparent", color: "#8899aa", border: "1px solid #1e3a5f", borderRadius: "6px", fontSize: "14px", cursor: "pointer" },
  btnRow: { display: "flex", gap: "12px", marginTop: "24px", paddingBottom: "48px", flexWrap: "wrap" },
  harmBadge: (level) => ({ display: "inline-block", padding: "3px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: "700", background: level === "likely" ? "#8B1A1A22" : level === "borderline" ? "#7A4F0022" : "#1A6B3A22", border: `1px solid ${level === "likely" ? "#8B1A1A" : level === "borderline" ? "#7A4F00" : "#1A6B3A"}`, color: level === "likely" ? "#ff6b6b" : level === "borderline" ? "#ffaa44" : "#4dbb7a", marginLeft: "8px" }),
};

const printStyles = `
  @media print {
    body { background: #0f1923 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    nav { display: none !important; }
    .no-print { display: none !important; }
    .print-container { max-width: 100% !important; padding: 20px !important; }
  }
`;

function ObligationBlock({ obligation }) {
  const isWarning = obligation.action.includes("WARNING") ||
    obligation.action.includes("REMINDER") ||
    obligation.action.includes("CRITICAL");
  return (
    <div style={{ ...s.obligationBlock, borderColor: isWarning ? "#8B1A1A" : "#1e3a5f", background: isWarning ? "#8B1A1A11" : "#0a1520" }}>
      <div style={{ ...s.obligationAction, color: isWarning ? "#ff6b6b" : "#2E75B6" }}>
        {isWarning ? "! " : "-> "}{obligation.action}
      </div>
      <div style={s.obligationRow}>
        <span style={s.obligationKey}>Deadline</span>
        <span style={{ ...s.obligationVal, color: "#ffaa44", fontWeight: "600" }}>{obligation.deadline}</span>
      </div>
      <div style={s.obligationRow}>
        <span style={s.obligationKey}>Method</span>
        <span style={s.obligationVal}>{obligation.method}</span>
      </div>
      <div style={{ ...s.obligationRow, flexDirection: "column" }}>
        <span style={{ ...s.obligationKey, marginBottom: "4px" }}>Include</span>
        <ul style={s.contentList}>
          {obligation.content.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div>
      {obligation.note && (
        <div style={{ marginTop: "10px", padding: "8px 12px", background: "#0f1923", borderRadius: "4px", fontSize: "11px", color: "#556677", fontStyle: "italic" }}>
          Note: {obligation.note}
        </div>
      )}
    </div>
  );
}

function StreamCard({ stream }) {
  return (
    <div style={s.streamCard(stream.applicable)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: stream.applicable ? "16px" : "0" }}>
        <div>
          <div style={{ fontSize: "15px", fontWeight: "600", color: "#fff" }}>{stream.stream}</div>
          <div style={{ fontSize: "12px", color: "#556677", marginTop: "2px" }}>{stream.regulator}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {stream.deadline && <span style={s.deadlineBadge(stream.deadline)}>{stream.deadline}</span>}
          <span style={s.statusBadge(stream.applicable)}>{stream.applicable ? "TRIGGERED" : "NOT TRIGGERED"}</span>
        </div>
      </div>
      {stream.applicable && stream.obligations.length > 0 && (
        <div>{stream.obligations.map((ob, i) => <ObligationBlock key={i} obligation={ob} />)}</div>
      )}
      {stream.seriousHarmAssessment && (
        <div style={{ marginTop: "12px", padding: "12px", background: "#0f1923", borderRadius: "6px" }}>
          <div style={{ fontSize: "11px", color: "#556677", marginBottom: "8px" }}>
            Serious Harm Assessment
            <span style={s.harmBadge(stream.seriousHarmAssessment.likely ? "likely" : stream.seriousHarmAssessment.borderline ? "borderline" : "unlikely")}>
              {stream.seriousHarmAssessment.likely ? "LIKELY" : stream.seriousHarmAssessment.borderline ? "BORDERLINE" : "NOT LIKELY"}
            </span>
            <span style={{ marginLeft: "8px", color: "#2E75B6", fontSize: "11px" }}>Score: {stream.seriousHarmAssessment.score}</span>
          </div>
          <ul style={{ ...s.contentList, color: "#556677" }}>
            {stream.seriousHarmAssessment.factors.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </div>
      )}
      <div style={s.reasoningBlock}>
        <div style={{ fontSize: "10px", color: "#2E75B6", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>Engine Reasoning</div>
        {stream.reasoning.map((r, i) => <div key={i} style={{ fontSize: "12px", color: "#8899aa", lineHeight: "1.6" }}>- {r}</div>)}
      </div>
    </div>
  );
}

export default function ResultsPanel({ results, narrative, onReset, onCompare }) {
  const { summary, streams } = results;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={s.container} className="print-container">
      <style>{printStyles}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
        <div>
          <h2 style={{ color: "#fff", fontSize: "22px", marginBottom: "4px" }}>Obligation Brief</h2>
          <p style={{ color: "#556677", fontSize: "12px" }}>Generated: {new Date(results.timestamp).toLocaleString("en-AU")}</p>
          <p style={{ color: "#334455", fontSize: "11px", marginTop: "2px" }}>
            Designed and built by Jeshta Rao - GRC Analyst - ISO/IEC 27001 Lead Auditor
          </p>
        </div>
      </div>

      <div style={s.summaryGrid}>
        <div style={s.metricCard}>
          <div style={s.metricLabel}>Streams Triggered</div>
          <div style={{ ...s.metricValue, color: summary.totalStreamsTriggered > 0 ? "#ff6b6b" : "#4dbb7a" }}>{summary.totalStreamsTriggered} / 4</div>
          <div style={s.metricSub}>obligation streams active</div>
        </div>
        <div style={s.metricCard}>
          <div style={s.metricLabel}>Most Urgent Deadline</div>
          <div style={{ ...s.metricValue, fontSize: "18px", color: "#ff6b6b" }}>{summary.mostUrgentDeadline ? summary.mostUrgentDeadline.deadline : "None"}</div>
          <div style={s.metricSub}>{summary.mostUrgentDeadline ? summary.mostUrgentDeadline.regulator : "No active obligations"}</div>
        </div>
        <div style={s.metricCard}>
          <div style={s.metricLabel}>Active Streams</div>
          <div style={{ fontSize: "12px", color: "#8899aa", marginTop: "8px", lineHeight: "1.8" }}>
            {summary.activeStreamNames.length > 0
              ? summary.activeStreamNames.map((n, i) => <div key={i}>- {n}</div>)
              : <div style={{ color: "#4dbb7a" }}>No obligations triggered</div>}
          </div>
        </div>
      </div>

      {summary.deadlinesByUrgency.length > 0 && (
        <div style={s.card}>
          <div style={s.sectionTitle}>Notification Timeline - Ordered by Urgency</div>
          {summary.deadlinesByUrgency.map((d, i) => (
            <div key={i} style={s.timelineRow}>
              <span style={s.deadlineBadge(d.deadline)}>{d.deadline}</span>
              <span style={{ fontSize: "13px", color: "#ccd6e0", flex: 1 }}>{d.stream}</span>
              <span style={{ fontSize: "12px", color: "#556677" }}>{d.regulator}</span>
            </div>
          ))}
        </div>
      )}

      {narrative && (
        <div style={s.narrativeCard}>
          <div style={{ fontSize: "10px", color: "#2E75B6", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "12px" }}>Plain-English Summary - Generated by Claude</div>
          <div style={{ fontSize: "14px", color: "#ccd6e0", lineHeight: "1.8" }}>{narrative}</div>
        </div>
      )}

      <div style={s.sectionTitle}>Detailed Obligation Breakdown</div>
      <StreamCard stream={streams.soci} />
      <StreamCard stream={streams.cps234} />
      <StreamCard stream={streams.ndb} />
      <StreamCard stream={streams.corporationsAct} />

      <div style={{ marginTop: "32px", padding: "16px", background: "#0a1520", borderRadius: "6px", fontSize: "11px", color: "#556677", lineHeight: "1.7", borderLeft: "3px solid #1e3a5f" }}>
        <strong style={{ color: "#8899aa" }}>Disclaimer:</strong> This tool provides decision support only and does not constitute legal advice. Regulatory obligations reflect the Australian position as at June 2026 and may change. Organisations must seek legal counsel before making final notification decisions. This tool does not cover all state-based obligations or sector-specific variations.
      </div>

      <div style={s.btnRow} className="no-print">
        <button style={s.exportBtn} onClick={handlePrint}>
          Download as PDF
        </button>
        {onCompare && (
          <button style={s.compareBtn} onClick={onCompare}>
            Add and Compare Another Scenario
          </button>
        )}
        <button style={s.newBtn} onClick={onReset}>
          Run New Scenario
        </button>
      </div>
    </div>
  );
}