import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useUser } from "@clerk/clerk-react";

const s = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "40px 24px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
  backBtn: {
    padding: "10px 20px",
    background: "transparent",
    color: "#8899aa",
    border: "1px solid #1e3a5f",
    borderRadius: "6px",
    fontSize: "13px",
    cursor: "pointer",
  },
  emptyState: {
    textAlign: "center",
    padding: "80px 24px",
    color: "#556677",
    fontSize: "14px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    background: "#1B3A6B",
    color: "#fff",
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    padding: "12px 16px",
    textAlign: "left",
    borderBottom: "1px solid #1e3a5f",
  },
  tr: (i) => ({
    background: i % 2 === 0 ? "#111e2d" : "#0f1923",
    cursor: "pointer",
    transition: "background 0.15s",
  }),
  td: {
    padding: "14px 16px",
    fontSize: "13px",
    color: "#ccd6e0",
    borderBottom: "1px solid #0d1a27",
  },
  deadlineBadge: (deadline) => {
    if (!deadline) return { color: "#556677", fontSize: "12px" };
    const d = deadline.toUpperCase();
    if (d.includes("12") || d === "IMMEDIATELY") return {
      color: "#ff6b6b", fontWeight: "600", fontSize: "12px"
    };
    if (d.includes("72") || d.includes("10 BUSINESS")) return {
      color: "#ffaa44", fontWeight: "600", fontSize: "12px"
    };
    return { color: "#6bb3ff", fontWeight: "600", fontSize: "12px" };
  },
  streamsBadge: (count) => ({
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "700",
    background: count > 0 ? "#8B1A1A22" : "#1A6B3A22",
    border: `1px solid ${count > 0 ? "#8B1A1A" : "#1A6B3A"}`,
    color: count > 0 ? "#ff6b6b" : "#4dbb7a",
  }),
  loadingText: {
    textAlign: "center",
    padding: "60px",
    color: "#556677",
    fontSize: "14px",
  },
};

function formatDate(ts) {
  return new Date(ts).toLocaleString("en-AU", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

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

export default function ScenarioHistory({ onBack, onViewScenario }) {
  const { user } = useUser();
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScenarios() {
      if (!user) return;
      const { data, error } = await supabase
        .from("scenarios")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) setScenarios(data);
      setLoading(false);
    }
    fetchScenarios();
  }, [user]);

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div>
          <div style={s.title}>Scenario History</div>
          <div style={s.subtitle}>
            Your past obligation assessments - click any row to view the full brief
          </div>
        </div>
        <button style={s.backBtn} onClick={onBack}>- Back</button>
      </div>

      {loading && <div style={s.loadingText}>Loading your scenarios...</div>}

      {!loading && scenarios.length === 0 && (
        <div style={s.emptyState}>
          <div style={{ fontSize: "32px", marginBottom: "16px" }}>📋</div>
          <div style={{ color: "#ccd6e0", marginBottom: "8px" }}>No scenarios yet</div>
          <div>Run your first scenario to see it here.</div>
        </div>
      )}

      {!loading && scenarios.length > 0 && (
        <table style={s.table}>
          <thead>
            <tr>
              {["Date", "Sector", "Incident Type", "Streams", "Most Urgent Deadline", "Regulator"].map((h, i) => (
                <th key={i} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scenarios.map((sc, i) => (
              <tr
                key={sc.id}
                style={s.tr(i)}
                onClick={() => onViewScenario && onViewScenario(sc)}
                onMouseEnter={e => e.currentTarget.style.background = "#1e3a5f33"}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#111e2d" : "#0f1923"}
              >
                <td style={s.td}>{formatDate(sc.created_at)}</td>
                <td style={s.td}>{formatSector(sc.sector)}</td>
                <td style={s.td}>{formatIncident(sc.incident_type)}</td>
                <td style={s.td}>
                  <span style={s.streamsBadge(sc.streams_triggered)}>
                    {sc.streams_triggered} / 4
                  </span>
                </td>
                <td style={s.td}>
                  <span style={s.deadlineBadge(sc.most_urgent_deadline)}>
                    {sc.most_urgent_deadline || "None"}
                  </span>
                </td>
                <td style={s.td}>{sc.most_urgent_regulator || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}