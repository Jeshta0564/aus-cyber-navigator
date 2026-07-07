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

async function downloadComparisonExcel(slotA, slotB) {
  const ExcelJS = (await import("exceljs")).default;
  const wb = new ExcelJS.Workbook();
  wb.creator = "AUS Cyber Incident Obligation Navigator";
  wb.created = new Date();

  const NAVY  = "FF1B3A6B"; const BLUE  = "FF2E75B6"; const LTBLUE = "FFD6E4F0";
  const WHITE = "FFFFFFFF"; const OFFWHT= "FFF7F9FC"; const LTGRAY = "FFF0F0F0";
  const DKGRAY= "FF2B2B2B"; const MEDGRY= "FF888888"; const RED   = "FF8B1A1A";
  const LTRED = "FFFAE0E0"; const AMBER = "FF7A4F00"; const LTAMB = "FFFFF3D6";
  const GREEN = "FF1A6B3A"; const LTGRN = "FFD6EFE1";
  const AMBER2= "FFFF8C00";

  const fill = (hex) => ({ type: "pattern", pattern: "solid", fgColor: { argb: hex } });
  const bdr = () => { const t = { style: "thin", color: { argb: "FFCCCCCC" } }; return { top:t, bottom:t, left:t, right:t }; };
  const thickBdr = (a) => { const t = { style: "medium", color: { argb: a } }; return { top:t, bottom:t, left:t, right:t }; };

  function cell(ws, addr, val, fillC, fontC=DKGRAY, bold=false, wrap=true, align="left", size=9) {
    const c = ws.getCell(addr);
    c.value = val; c.fill = fill(fillC);
    c.font = { bold, color:{ argb: fontC }, name:"Arial", size };
    c.alignment = { horizontal: align, vertical:"middle", wrapText: wrap };
    c.border = bdr();
    return c;
  }

  function dlFill(deadline) {
    if (!deadline) return [LTGRAY, MEDGRY];
    const d = deadline.toUpperCase();
    if (d.includes("12 HOUR") || d==="IMMEDIATELY" || d==="IMMEDIATE") return [LTRED, RED];
    if (d.includes("72 HOUR") || d.includes("10 BUSINESS")) return [LTAMB, AMBER];
    return [LTBLUE, BLUE];
  }

  // ── SHEET 1: COMPARISON SUMMARY ──
  const ws1 = wb.addWorksheet("Comparison Summary");
  ws1.views = [{ showGridLines: false }];
  ws1.columns = [{width:2},{width:28},{width:28},{width:28},{width:2}];

  ws1.mergeCells("B1:D1"); ws1.getRow(1).height = 8;
  ws1.mergeCells("B2:D2"); ws1.getRow(2).height = 38;
  const t = ws1.getCell("B2");
  t.value = "SCENARIO COMPARISON - AUSTRALIAN CYBER INCIDENT OBLIGATION NAVIGATOR";
  t.fill = fill(NAVY); t.font = { bold:true, color:{argb:WHITE}, name:"Arial", size:14 };
  t.alignment = { horizontal:"center", vertical:"middle" }; t.border = thickBdr(NAVY);
  ws1.getRow(3).height = 10;

  // Column headers
  ws1.getRow(4).height = 22;
  [["B","Obligation / Factor"],["C","Scenario A"],["D","Scenario B"]].forEach(([col, label]) => {
    const c = ws1.getCell(`${col}4`);
    c.value = label; c.fill = fill(NAVY);
    c.font = { bold:true, color:{argb:WHITE}, name:"Arial", size:10 };
    c.alignment = { horizontal:"center", vertical:"middle" }; c.border = bdr();
  });

  // Scenario labels
  ws1.getRow(5).height = 20;
  cell(ws1,"B5","Sector / Incident",LTGRAY,MEDGRY,true,false,"left",9);
  const sectorA = slotA.inputs ? `${formatSector(slotA.inputs.sector)} / ${formatIncident(slotA.inputs.incidentType)}` : "Scenario A";
  const sectorB = slotB.inputs ? `${formatSector(slotB.inputs.sector)} / ${formatIncident(slotB.inputs.incidentType)}` : "Scenario B";
  cell(ws1,"C5",sectorA,LTBLUE,NAVY,true,false,"center",9);
  cell(ws1,"D5",sectorB,LTBLUE,NAVY,true,false,"center",9);

  // Streams triggered
  ws1.getRow(6).height = 20;
  cell(ws1,"B6","Streams Triggered",LTGRAY,MEDGRY,true,false,"left",9);
  cell(ws1,"C6",`${slotA.results.summary.totalStreamsTriggered} of 4`,OFFWHT,slotA.results.summary.totalStreamsTriggered > 0 ? RED : GREEN,true,false,"center",11);
  cell(ws1,"D6",`${slotB.results.summary.totalStreamsTriggered} of 4`,OFFWHT,slotB.results.summary.totalStreamsTriggered > 0 ? RED : GREEN,true,false,"center",11);

  // Most urgent deadline
  ws1.getRow(7).height = 20;
  cell(ws1,"B7","Most Urgent Deadline",LTGRAY,MEDGRY,true,false,"left",9);
  const [dlFillA, dlFontA] = dlFill(slotA.results.summary.mostUrgentDeadline?.deadline);
  const [dlFillB, dlFontB] = dlFill(slotB.results.summary.mostUrgentDeadline?.deadline);
  cell(ws1,"C7",slotA.results.summary.mostUrgentDeadline?.deadline || "None",dlFillA,dlFontA,true,false,"center",10);
  cell(ws1,"D7",slotB.results.summary.mostUrgentDeadline?.deadline || "None",dlFillB,dlFontB,true,false,"center",10);

  // Lead regulator
  ws1.getRow(8).height = 20;
  cell(ws1,"B8","Lead Regulator",LTGRAY,MEDGRY,true,false,"left",9);
  cell(ws1,"C8",slotA.results.summary.mostUrgentDeadline?.regulator || "N/A",OFFWHT,DKGRAY,false,false,"center",9);
  cell(ws1,"D8",slotB.results.summary.mostUrgentDeadline?.regulator || "N/A",OFFWHT,DKGRAY,false,false,"center",9);

  ws1.getRow(9).height = 10;

  // Per stream comparison
  ws1.getRow(10).height = 20;
  [["B","Obligation Stream"],["C","Scenario A"],["D","Scenario B"]].forEach(([col, label]) => {
    const c = ws1.getCell(`${col}10`);
    c.value = label; c.fill = fill(BLUE);
    c.font = { bold:true, color:{argb:WHITE}, name:"Arial", size:10 };
    c.alignment = { horizontal:"center", vertical:"middle" }; c.border = bdr();
  });

  const streams = [
    { key: "soci", label: "SOCI Act" },
    { key: "cps234", label: "APRA CPS 234" },
    { key: "ndb", label: "Privacy Act - NDB Scheme" },
    { key: "corporationsAct", label: "Corporations Act" },
  ];

  streams.forEach((stream, i) => {
    const r = 11 + i;
    const sA = slotA.results.streams[stream.key];
    const sB = slotB.results.streams[stream.key];
    const isDiff = sA.applicable !== sB.applicable || sA.deadline !== sB.deadline;
    const rowBg = i % 2 === 0 ? OFFWHT : WHITE;
    const highlightBg = isDiff ? "FFFFF3D6" : rowBg;

    ws1.getRow(r).height = 22;
    cell(ws1,`B${r}`,stream.label,isDiff ? "FFFFF3D6" : LTGRAY, isDiff ? AMBER : MEDGRY,true,false,"left",9);

    const valA = sA.applicable
      ? `TRIGGERED${sA.deadline ? " - " + sA.deadline : ""}`
      : "NOT TRIGGERED";
    const valB = sB.applicable
      ? `TRIGGERED${sB.deadline ? " - " + sB.deadline : ""}`
      : "NOT TRIGGERED";

    const [fgA, ftA] = sA.applicable ? [LTGRN, GREEN] : [LTRED, RED];
    const [fgB, ftB] = sB.applicable ? [LTGRN, GREEN] : [LTRED, RED];

    cell(ws1,`C${r}`,valA,fgA,ftA,true,false,"center",9);
    cell(ws1,`D${r}`,valB,fgB,ftB,true,false,"center",9);
  });

  ws1.getRow(15).height = 10;

  // Narratives
  if (slotA.narrative || slotB.narrative) {
    ws1.mergeCells("B16:D16"); ws1.getRow(16).height = 16;
    cell(ws1,"B16","PLAIN-ENGLISH SUMMARIES",LTBLUE,BLUE,true,false,"left",8);

    ws1.getRow(17).height = 16;
    cell(ws1,"B17","",LTGRAY,MEDGRY,true,false,"left",9);
    cell(ws1,"C17","Scenario A Summary",LTBLUE,BLUE,true,false,"center",9);
    cell(ws1,"D17","Scenario B Summary",LTBLUE,BLUE,true,false,"center",9);

    for (let i = 18; i <= 24; i++) ws1.getRow(i).height = 16;
    ws1.mergeCells("B18:B24");
    cell(ws1,"B18","Claude Summary",LTGRAY,MEDGRY,true,false,"left",9);
    ws1.mergeCells("C18:C24");
    const ncA = ws1.getCell("C18");
    ncA.value = slotA.narrative || "Not available";
    ncA.fill = fill(OFFWHT);
    ncA.font = { color:{argb:DKGRAY}, name:"Arial", size:9 };
    ncA.alignment = { horizontal:"left", vertical:"top", wrapText:true };
    ncA.border = bdr();
    ws1.mergeCells("D18:D24");
    const ncB = ws1.getCell("D18");
    ncB.value = slotB.narrative || "Not available";
    ncB.fill = fill(OFFWHT);
    ncB.font = { color:{argb:DKGRAY}, name:"Arial", size:9 };
    ncB.alignment = { horizontal:"left", vertical:"top", wrapText:true };
    ncB.border = bdr();
  }

  // ── SHEET 2: SCENARIO A DETAIL ──
  const ws2 = wb.addWorksheet("Scenario A - Detail");
  ws2.views = [{ showGridLines: false }];
  ws2.columns = [{width:2},{width:26},{width:16},{width:18},{width:34},{width:28},{width:42},{width:2}];
  ws2.mergeCells("B1:G1"); ws2.getRow(1).height = 8;
  ws2.mergeCells("B2:G2"); ws2.getRow(2).height = 30;
  const a2t = ws2.getCell("B2");
  a2t.value = `SCENARIO A - ${sectorA}`;
  a2t.fill = fill(NAVY); a2t.font = { bold:true, color:{argb:WHITE}, name:"Arial", size:13 };
  a2t.alignment = { horizontal:"center", vertical:"middle" }; a2t.border = thickBdr(NAVY);

  // ── SHEET 3: SCENARIO B DETAIL ──
  const ws3 = wb.addWorksheet("Scenario B - Detail");
  ws3.views = [{ showGridLines: false }];
  ws3.columns = [{width:2},{width:26},{width:16},{width:18},{width:34},{width:28},{width:42},{width:2}];
  ws3.mergeCells("B1:G1"); ws3.getRow(1).height = 8;
  ws3.mergeCells("B2:G2"); ws3.getRow(2).height = 30;
  const b2t = ws3.getCell("B2");
  b2t.value = `SCENARIO B - ${sectorB}`;
  b2t.fill = fill(NAVY); b2t.font = { bold:true, color:{argb:WHITE}, name:"Arial", size:13 };
  b2t.alignment = { horizontal:"center", vertical:"middle" }; b2t.border = thickBdr(NAVY);

  // ── WRITE FILE ──
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "AUS_Cyber_Comparison_Brief.xlsx";
  a.click(); URL.revokeObjectURL(url);
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
        <button style={s.exportBtn} onClick={() => downloadComparisonExcel(slotA, slotB)}>
          Download Comparison Excel
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