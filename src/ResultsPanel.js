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

async function downloadExcel(results, narrative) {
  const ExcelJS = (await import("exceljs")).default;
  const wb = new ExcelJS.Workbook();
  wb.creator = "AUS Cyber Incident Obligation Navigator";
  wb.created = new Date();
  const ts = new Date(results.timestamp).toLocaleString("en-AU");

  const NAVY  = "FF1B3A6B"; const BLUE  = "FF2E75B6"; const LTBLUE = "FFD6E4F0";
  const WHITE = "FFFFFFFF"; const OFFWHT= "FFF7F9FC"; const LTGRAY = "FFF0F0F0";
  const DKGRAY= "FF2B2B2B"; const MEDGRY= "FF888888"; const RED   = "FF8B1A1A";
  const LTRED = "FFFAE0E0"; const AMBER = "FF7A4F00"; const LTAMB = "FFFFF3D6";
  const GREEN = "FF1A6B3A"; const LTGRN = "FFD6EFE1";

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

  function dlColors(deadline) {
    if (!deadline) return [LTGRAY, MEDGRY];
    const d = deadline.toUpperCase();
    if (d.includes("12 HOUR") || d==="IMMEDIATELY" || d==="IMMEDIATE") return [LTRED, RED];
    if (d.includes("72 HOUR") || d.includes("10 BUSINESS")) return [LTAMB, AMBER];
    return [LTBLUE, BLUE];
  }

  const ws1 = wb.addWorksheet("Dashboard");
  ws1.views = [{ showGridLines: false }];
  ws1.columns = [{width:2},{width:28},{width:22},{width:22},{width:22},{width:2}];

  ws1.mergeCells("B1:E1"); ws1.getRow(1).height = 8;
  ws1.mergeCells("B2:E2"); ws1.getRow(2).height = 38;
  const t = ws1.getCell("B2");
  t.value = "AUSTRALIAN CYBER INCIDENT OBLIGATION NAVIGATOR";
  t.fill = fill(NAVY); t.font = { bold:true, color:{argb:WHITE}, name:"Arial", size:16 };
  t.alignment = { horizontal:"center", vertical:"middle" }; t.border = thickBdr(NAVY);

  ws1.mergeCells("B3:E3"); ws1.getRow(3).height = 18;
  const sub = ws1.getCell("B3");
  sub.value = `Jeshta Rao  |  GRC Analyst  |  ISO/IEC 27001 Lead Auditor  |  Generated: ${ts}`;
  sub.fill = fill(BLUE); sub.font = { italic:true, color:{argb:WHITE}, name:"Arial", size:9 };
  sub.alignment = { horizontal:"center", vertical:"middle" };
  ws1.getRow(4).height = 10;

  [
    ["B","STREAMS TRIGGERED", `${results.summary.totalStreamsTriggered} of 4`, results.summary.totalStreamsTriggered > 0 ? RED : GREEN],
    ["C","MOST URGENT DEADLINE", results.summary.mostUrgentDeadline?.deadline || "None", RED],
    ["D","LEAD REGULATOR", results.summary.mostUrgentDeadline?.regulator || "N/A", BLUE],
    ["E","STREAMS NOT TRIGGERED", `${4 - results.summary.totalStreamsTriggered} of 4`, MEDGRY],
  ].forEach(([col, label, val, vc]) => {
    ws1.mergeCells(`${col}5:${col}6`);
    const lc = ws1.getCell(`${col}5`);
    lc.value = label; lc.fill = fill(LTBLUE);
    lc.font = { bold:true, color:{argb:BLUE}, name:"Arial", size:8 };
    lc.alignment = { horizontal:"left", vertical:"top", wrapText:true }; lc.border = bdr();
    ws1.getRow(5).height = 14; ws1.getRow(6).height = 6;
    ws1.mergeCells(`${col}7:${col}8`);
    const mc = ws1.getCell(`${col}7`);
    mc.value = val; mc.fill = fill(OFFWHT);
    mc.font = { bold:true, color:{argb:vc}, name:"Arial", size:13 };
    mc.alignment = { horizontal:"center", vertical:"middle" }; mc.border = thickBdr(vc);
    ws1.getRow(7).height = 28; ws1.getRow(8).height = 8;
  });

  ws1.getRow(9).height = 10;
  ws1.mergeCells("B10:E10"); ws1.getRow(10).height = 16;
  cell(ws1,"B10","NOTIFICATION TIMELINE - ORDERED BY URGENCY",LTGRAY,MEDGRY,true,false,"left",8);

  ws1.getRow(11).height = 20;
  ["B","C","D","E"].forEach((col, i) => {
    const labels = ["Obligation Stream","Regulator","Deadline","Status"];
    const c = ws1.getCell(`${col}11`);
    c.value = labels[i]; c.fill = fill(NAVY);
    c.font = { bold:true, color:{argb:WHITE}, name:"Arial", size:10 };
    c.alignment = { horizontal:"center", vertical:"middle" }; c.border = bdr();
  });

  results.summary.deadlinesByUrgency.forEach((d, i) => {
    const r = 12 + i; ws1.getRow(r).height = 18;
    const bg = i%2===0 ? OFFWHT : WHITE;
    const [df, dfont] = dlColors(d.deadline);
    cell(ws1,`B${r}`,d.stream,LTBLUE,NAVY,true);
    cell(ws1,`C${r}`,d.regulator,bg,DKGRAY);
    cell(ws1,`D${r}`,d.deadline,df,dfont,true,false,"center");
    cell(ws1,`E${r}`,"ACTIVE",LTGRN,GREEN,true,false,"center");
  });

  const allStreams = [
    {name:"SOCI Act",reg:"ASD (ACSC)"},{name:"APRA CPS 234",reg:"APRA"},
    {name:"Privacy Act - NDB Scheme",reg:"OAIC"},{name:"Corporations Act",reg:"ASIC / ASX"},
  ];
  const triggered = results.summary.activeStreamNames;
  allStreams.filter(st => !triggered.some(n => n.includes(st.name.split(" ")[0]))).forEach((st,i) => {
    const r = 12 + results.summary.deadlinesByUrgency.length + i;
    ws1.getRow(r).height = 18;
    cell(ws1,`B${r}`,st.name,LTGRAY,MEDGRY);
    cell(ws1,`C${r}`,st.reg,LTGRAY,MEDGRY);
    cell(ws1,`D${r}`,"N/A",LTGRAY,MEDGRY,false,false,"center");
    cell(ws1,`E${r}`,"NOT TRIGGERED",LTRED,RED,true,false,"center");
  });

  const lastR = 12 + results.summary.deadlinesByUrgency.length +
    allStreams.filter(st => !triggered.some(n => n.includes(st.name.split(" ")[0]))).length;
  ws1.getRow(lastR+1).height = 10;

  if (narrative) {
    ws1.mergeCells(`B${lastR+2}:E${lastR+2}`); ws1.getRow(lastR+2).height = 16;
    cell(ws1,`B${lastR+2}`,"PLAIN-ENGLISH SUMMARY - GENERATED BY CLAUDE",LTBLUE,BLUE,true,false,"left",8);
    ws1.mergeCells(`B${lastR+3}:E${lastR+9}`);
    const nc = ws1.getCell(`B${lastR+3}`);
    nc.value = narrative; nc.fill = fill(OFFWHT);
    nc.font = { color:{argb:DKGRAY}, name:"Arial", size:9 };
    nc.alignment = { horizontal:"left", vertical:"top", wrapText:true };
    nc.border = thickBdr(BLUE);
    for (let i=lastR+3; i<=lastR+9; i++) ws1.getRow(i).height = 16;
  }

  const ws2 = wb.addWorksheet("Obligation Detail");
  ws2.views = [{ showGridLines: false }];
  ws2.columns = [{width:2},{width:26},{width:16},{width:18},{width:34},{width:28},{width:42},{width:2}];

  ws2.mergeCells("B1:G1"); ws2.getRow(1).height = 8;
  ws2.mergeCells("B2:G2"); ws2.getRow(2).height = 30;
  const d2t = ws2.getCell("B2");
  d2t.value = "DETAILED OBLIGATION BREAKDOWN"; d2t.fill = fill(NAVY);
  d2t.font = { bold:true, color:{argb:WHITE}, name:"Arial", size:13 };
  d2t.alignment = { horizontal:"center", vertical:"middle" }; d2t.border = thickBdr(NAVY);
  ws2.getRow(3).height = 10;

  ws2.getRow(4).height = 22;
  ["B","C","D","E","F","G"].forEach((col,i) => {
    const labels = ["Stream","Status","Deadline","Action Required","Method","Content Required"];
    const c = ws2.getCell(`${col}4`);
    c.value = labels[i]; c.fill = fill(NAVY);
    c.font = { bold:true, color:{argb:WHITE}, name:"Arial", size:10 };
    c.alignment = { horizontal:"center", vertical:"middle" }; c.border = bdr();
  });

  let dr = 5;
  Object.values(results.streams).forEach(stream => {
    const [sf, sfont] = stream.applicable ? [LTGRN,GREEN] : [LTRED,RED];
    const [df, dfont] = dlColors(stream.deadline);
    if (stream.obligations && stream.obligations.length > 0) {
      stream.obligations.forEach((ob,oi) => {
        const bg = oi%2===0 ? OFFWHT : WHITE;
        const isWarn = ob.action.includes("WARNING")||ob.action.includes("CRITICAL")||ob.action.includes("REMINDER");
        ws2.getRow(dr).height = 48;
        cell(ws2,`B${dr}`,stream.stream,LTBLUE,NAVY,true);
        cell(ws2,`C${dr}`,stream.applicable?"TRIGGERED":"NOT TRIGGERED",sf,sfont,true,false,"center");
        cell(ws2,`D${dr}`,stream.deadline||"N/A",df,dfont,true,false,"center");
        cell(ws2,`E${dr}`,ob.action,isWarn?LTRED:bg,isWarn?RED:DKGRAY,isWarn);
        cell(ws2,`F${dr}`,ob.method,bg,DKGRAY);
        cell(ws2,`G${dr}`,ob.content?ob.content.join("\n- "):"",bg,DKGRAY);
        dr++;
      });
    } else {
      ws2.getRow(dr).height = 28;
      cell(ws2,`B${dr}`,stream.stream,LTGRAY,MEDGRY);
      cell(ws2,`C${dr}`,"NOT TRIGGERED",LTRED,RED,true,false,"center");
      cell(ws2,`D${dr}`,"N/A",LTGRAY,MEDGRY,false,false,"center");
      cell(ws2,`E${dr}`,stream.reasoning?stream.reasoning.join(" "):"",LTGRAY,MEDGRY,false,true);
      cell(ws2,`F${dr}`,"",LTGRAY,MEDGRY);
      cell(ws2,`G${dr}`,"",LTGRAY,MEDGRY);
      dr++;
    }
  });

  const ndb = results.streams.ndb;
  if (ndb && ndb.seriousHarmAssessment) {
    const sha = ndb.seriousHarmAssessment;
    const ws3 = wb.addWorksheet("Serious Harm Assessment");
    ws3.views = [{ showGridLines: false }];
    ws3.columns = [{width:2},{width:30},{width:52},{width:2}];

    ws3.mergeCells("B1:C1"); ws3.getRow(1).height = 8;
    ws3.mergeCells("B2:C2"); ws3.getRow(2).height = 30;
    const s3t = ws3.getCell("B2");
    s3t.value = "SERIOUS HARM ASSESSMENT - NDB SCHEME (CONDITION 3)";
    s3t.fill = fill(NAVY); s3t.font = { bold:true, color:{argb:WHITE}, name:"Arial", size:13 };
    s3t.alignment = { horizontal:"center", vertical:"middle" }; s3t.border = thickBdr(NAVY);
    ws3.getRow(3).height = 10;

    const detF = sha.likely ? LTRED : sha.borderline ? LTAMB : LTGRN;
    const detFt = sha.likely ? RED : sha.borderline ? AMBER : GREEN;
    const det = sha.likely
      ? "SERIOUS HARM LIKELY - Eligible Data Breach confirmed. Notify OAIC and affected individuals."
      : sha.borderline
      ? "BORDERLINE - Seek legal advice before making notification decision."
      : "SERIOUS HARM NOT LIKELY - Document your assessment and retain records.";

    ws3.mergeCells("B4:C4"); ws3.getRow(4).height = 20;
    cell(ws3,"B4","DETERMINATION",BLUE,WHITE,true,false,"center",10);
    ws3.mergeCells("B5:C5"); ws3.getRow(5).height = 36;
    cell(ws3,"B5",det,detF,detFt,true,true,"center");
    ws3.mergeCells("B6:C6"); ws3.getRow(6).height = 20;
    cell(ws3,"B6",`Risk Score: ${sha.score}   (6+ = Likely  |  3-5 = Borderline  |  0-2 = Not Likely)`,OFFWHT,MEDGRY,false,false,"center");
    ws3.getRow(7).height = 10;

    ws3.getRow(8).height = 22;
    ["B","C"].forEach((col,i) => {
      const c = ws3.getCell(`${col}8`);
      c.value = ["Factor Assessed","Detail"][i]; c.fill = fill(NAVY);
      c.font = { bold:true, color:{argb:WHITE}, name:"Arial", size:10 };
      c.alignment = { horizontal:"center", vertical:"middle" }; c.border = bdr();
    });

    sha.factors.forEach((factor, i) => {
      const r = 9+i; const bg = i%2===0 ? OFFWHT : WHITE;
      const hi = factor.toLowerCase().includes("high")||factor.toLowerCase().includes("critical");
      ws3.getRow(r).height = 22;
      cell(ws3,`B${r}`,`Factor ${i+1}`,hi?LTRED:bg,hi?RED:MEDGRY,true,false,"center");
      cell(ws3,`C${r}`,factor,bg,DKGRAY);
    });

    const nr = 9+sha.factors.length+1; ws3.mergeCells(`B${nr}:C${nr}`); ws3.getRow(nr).height = 40;
    cell(ws3,`B${nr}`,"OAIC POSITION: Attacker assurances following ransom payment do NOT reduce serious harm likelihood. This is OAIC confirmed regulatory position (H1 2024 report).",LTRED,RED,true,true);
  }

  const ws4 = wb.addWorksheet("Disclaimer");
  ws4.views = [{ showGridLines: false }];
  ws4.columns = [{width:2},{width:80},{width:2}];

  ws4.mergeCells("B1:B1"); ws4.getRow(1).height = 8;
  ws4.getRow(2).height = 28; cell(ws4,"B2","DISCLAIMER AND LIMITATIONS",NAVY,WHITE,true,false,"center",13);
  ws4.getRow(3).height = 10;

  [
    ["Decision Support Only","This tool provides decision support and does not constitute legal advice. Organisations must engage qualified legal counsel before making any regulatory notification decisions."],
    ["Currency of Information","Regulatory obligations reflect the Australian position as at June 2026. Australian cyber legislation and APRA prudential standards are subject to amendment. This tool does not update automatically."],
    ["Scope Limitations","This tool covers primary federal notification obligations across the SOCI Act, APRA CPS 234, Privacy Act NDB Scheme, and Corporations Act. It does not cover all state-based obligations, sector-specific variations, or overseas obligations for multinational entities."],
    ["Serious Harm Assessment","The serious harm assessment under the NDB scheme involves subjective legal judgment. The engine applies OAIC guidance as at June 2026 but cannot replace legal advice on threshold determinations."],
    ["APRA Notifications","APRA requires direct communication through its Secure Stakeholder Portal. This tool maps the obligation but does not facilitate the notification itself."],
  ].forEach(([title, text], i) => {
    const r = 4 + i*3;
    ws4.getRow(r).height = 18; ws4.getRow(r+1).height = 36; ws4.getRow(r+2).height = 6;
    cell(ws4,`B${r}`,title,LTBLUE,BLUE,true,false);
    cell(ws4,`B${r+1}`,text,OFFWHT,DKGRAY,false,true);
  });

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "AUS_Cyber_Obligation_Brief.xlsx";
  a.click(); URL.revokeObjectURL(url);
}

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
  return (
    <div style={s.container}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
        <div>
          <h2 style={{ color: "#fff", fontSize: "22px", marginBottom: "4px" }}>Obligation Brief</h2>
          <p style={{ color: "#556677", fontSize: "12px" }}>Generated: {new Date(results.timestamp).toLocaleString("en-AU")}</p>
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

      <div style={s.btnRow}>
        <button style={s.exportBtn} onClick={() => downloadExcel(results, narrative)}>
          Download Excel Report
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