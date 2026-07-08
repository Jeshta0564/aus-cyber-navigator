import ScenarioHistory from "./ScenarioHistory";
import { supabase } from "./supabaseClient";
import AboutPage from "./AboutPage";
import { useState } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import ScenarioForm from "./ScenarioForm";
import ComparisonResults from "./ComparisonResults";
import ResultsPanel from "./ResultsPanel";
import { runObligationEngine } from "./obligationEngine";

const styles = {
  app: {
    background: "#0f1923",
    minHeight: "100vh",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 32px",
    borderBottom: "1px solid #1e3a5f",
    background: "#0a1520",
  },
  navLeft: {
    display: "flex",
    flexDirection: "column",
  },
  navTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#fff",
    letterSpacing: "0.2px",
  },
  navSub: {
    fontSize: "11px",
    color: "#556677",
    marginTop: "2px",
  },
  landing: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#0f1923",
    textAlign: "center",
    padding: "24px",
  },
  badge: {
    display: "inline-block",
    padding: "4px 14px",
    background: "#1B3A6B22",
    border: "1px solid #2E75B6",
    borderRadius: "20px",
    fontSize: "11px",
    color: "#2E75B6",
    marginBottom: "24px",
    letterSpacing: "0.5px",
  },
  landingTitle: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "12px",
    lineHeight: "1.3",
    maxWidth: "600px",
  },
  landingDesc: {
    fontSize: "15px",
    color: "#8899aa",
    marginBottom: "40px",
    maxWidth: "520px",
    lineHeight: "1.7",
  },
  signInBtn: {
    background: "#2E75B6",
    color: "#fff",
    border: "none",
    padding: "14px 36px",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "16px",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    maxWidth: "640px",
    marginTop: "48px",
  },
  featureCard: {
    background: "#111e2d",
    border: "1px solid #1e3a5f",
    borderRadius: "8px",
    padding: "16px",
    textAlign: "left",
  },
  featureTitle: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#2E75B6",
    marginBottom: "6px",
  },
  featureDesc: {
    fontSize: "11px",
    color: "#556677",
    lineHeight: "1.6",
  },
  loadingOverlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "#0f1923cc",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  loadingText: {
    color: "#2E75B6",
    fontSize: "16px",
    marginTop: "16px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid #1e3a5f",
    borderTop: "3px solid #2E75B6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

export default function App() {
  const [view, setView] = useState("form");
  const [results, setResults] = useState(null);
  const [narrative, setNarrative] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  // ── Comparison state ──
  const [slotA, setSlotA] = useState(null); // { results, narrative, inputs }
  const [slotB, setSlotB] = useState(null); // { results, narrative, inputs }
  const [lockingSlot, setLockingSlot] = useState(null); // "A" or "B" -- which slot is being replaced
  const [comparisonId, setComparisonId] = useState(null);
  const [hasComparedOnce, setHasComparedOnce] = useState(false);

  // ── Generate UUID ──
  function generateId() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === "x" ? r : ((r & 0x3) | 0x8)).toString(16);
    });
  }

  // ── Single scenario submit ──
  async function handleFormSubmit(inputs) {
    setLoading(true);
    const engineResults = runObligationEngine(inputs);

    let generatedNarrative = "";
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs, engineResults }),
      });
      const data = await response.json();
      if (data.narrative) {
        generatedNarrative = data.narrative;
        setNarrative(data.narrative);
      }
    } catch (err) {
      setNarrative("Narrative generation unavailable. Please review the detailed obligation breakdown below.");
    }

    try {
      const userId = user?.id || "anonymous";
      await supabase.from("scenarios").insert({
        user_id: userId,
        sector: inputs.sector,
        incident_type: inputs.incidentType,
        streams_triggered: engineResults.summary.totalStreamsTriggered,
        most_urgent_deadline: engineResults.summary.mostUrgentDeadline?.deadline || null,
        most_urgent_regulator: engineResults.summary.mostUrgentDeadline?.regulator || null,
        narrative: generatedNarrative || null,
        results: engineResults,
      });
    } catch (err) {
      console.error("Failed to save scenario:", err);
    }

    setResults(engineResults);
    setLoading(false);
    setView("results");
  }

  // ── Comparison submit ──
  async function handleComparisonSubmit(inputs) {
    setLoading(true);
    const engineResults = runObligationEngine(inputs);

    let generatedNarrative = "";
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs, engineResults }),
      });
      const data = await response.json();
      if (data.narrative) {
        generatedNarrative = data.narrative;
      }
    } catch (err) {
      generatedNarrative = "Narrative generation unavailable.";
    }

    const newSlot = { results: engineResults, narrative: generatedNarrative, inputs };
    const sharedId = comparisonId || generateId();
    setComparisonId(sharedId);

    // Save both slots to Supabase with shared comparison_id
    try {
      const userId = user?.id || "anonymous";
      if (lockingSlot === "B" || !hasComparedOnce) { // eslint-disable-line no-mixed-operators
        // Saving slot B
        await supabase.from("scenarios").insert({
          user_id: userId,
          sector: inputs.sector,
          incident_type: inputs.incidentType,
          streams_triggered: engineResults.summary.totalStreamsTriggered,
          most_urgent_deadline: engineResults.summary.mostUrgentDeadline?.deadline || null,
          most_urgent_regulator: engineResults.summary.mostUrgentDeadline?.regulator || null,
          narrative: generatedNarrative || null,
          results: engineResults,
          comparison_id: sharedId,
        });
      } else if (lockingSlot === "A") {
        // Saving new slot A
        await supabase.from("scenarios").insert({
          user_id: userId,
          sector: inputs.sector,
          incident_type: inputs.incidentType,
          streams_triggered: engineResults.summary.totalStreamsTriggered,
          most_urgent_deadline: engineResults.summary.mostUrgentDeadline?.deadline || null,
          most_urgent_regulator: engineResults.summary.mostUrgentDeadline?.regulator || null,
          narrative: generatedNarrative || null,
          results: engineResults,
          comparison_id: sharedId,
        });
      }
    } catch (err) {
      console.error("Failed to save comparison scenario:", err);
    }

    if (lockingSlot === "A") {
      setSlotA(newSlot);
    } else {
      setSlotB(newSlot);
    }

    setHasComparedOnce(true);
    setLoading(false);
    setView("comparison");
  }

  // ── Start comparison from main form page ──
  function handleStartComparison(inputs) {
    const engineResults = runObligationEngine(inputs);
    setSlotA({ results: engineResults, narrative: "", inputs });
    setLockingSlot("B");
    setHasComparedOnce(false);
    setComparisonId(generateId());
    setView("comparison-form");
  }

  // ── Start comparison from results page ──
  function handleCompareFromResults() {
    setSlotA({ results, narrative, inputs: null });
    setLockingSlot("B");
    setHasComparedOnce(false);
    setComparisonId(generateId());
    setView("comparison-form");
  }

  // ── Change slot A or B ──
  function handleChangeSlot(slot) {
    setLockingSlot(slot);
    setView("comparison-form");
  }

  // ── Full reset ──
  function handleReset() {
    setView("form");
    setResults(null);
    setNarrative("");
    setSlotA(null);
    setSlotB(null);
    setLockingSlot(null);
    setComparisonId(null);
    setHasComparedOnce(false);
  }

  // ── Which slot is locked (for banner) ──
  function getLockedSlot() {
    if (lockingSlot === "B") return slotA;
    if (lockingSlot === "A") return slotB;
    return null;
  }

  return (
    <div style={styles.app}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <SignedOut>
        <div style={styles.landing}>
          <div style={styles.badge}>Australian GRC Tool · June 2026</div>
          <h1 style={styles.landingTitle}>
            Cyber Incident Obligation Navigator
          </h1>
          <p style={styles.landingDesc}>
            Determine your Australian regulatory notification obligations in minutes.
            Built on encoded regulatory logic across SOCI Act, APRA CPS 234,
            Privacy Act NDB Scheme, and Corporations Act.
          </p>
          <SignInButton mode="modal">
            <button style={styles.signInBtn}>Sign in to continue →</button>
          </SignInButton>
          <p style={{ fontSize: "12px", color: "#556677" }}>
            Sign in with Google or GitHub
          </p>
          <p style={{ fontSize: "11px", color: "#334455", marginTop: "24px" }}>
            Designed and built by{" "}
            <a
              href="https://www.linkedin.com/in/jeshta-rao-3491a6197"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#2E75B6", textDecoration: "none" }}
            >
              Jeshta Rao
            </a>
            {" "}· GRC Analyst · ISO/IEC 27001 Lead Auditor
          </p>
          <div style={styles.featureGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureTitle}>Rules-Based Engine</div>
              <div style={styles.featureDesc}>
                Regulatory logic encoded from primary Australian sources. Not AI guessing.
              </div>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureTitle}>4 Obligation Streams</div>
              <div style={styles.featureDesc}>
                SOCI Act, CPS 234, NDB Scheme, and Corporations Act assessed simultaneously.
              </div>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureTitle}>Serious Harm Scoring</div>
              <div style={styles.featureDesc}>
                Structured NDB serious harm assessment based on OAIC guidance.
              </div>
            </div>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        {loading && (
          <div style={styles.loadingOverlay}>
            <div style={styles.spinner} />
            <div style={styles.loadingText}>Running obligation engine...</div>
          </div>
        )}

        <nav style={styles.nav}>
          <div style={styles.navLeft}>
            <div style={styles.navTitle}>AUS Cyber Incident Obligation Navigator</div>
            <div style={styles.navSub}>
              Designed and built by Jeshta Rao · GRC Analyst · ISO/IEC 27001 Lead Auditor
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              style={{ padding: "8px 16px", background: view === "history" ? "#2E75B622" : "transparent", color: view === "history" ? "#2E75B6" : "#8899aa", border: "1px solid #1e3a5f", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}
              onClick={() => setView("history")}
            >
              My Scenarios
            </button>
            <button
              style={{ padding: "8px 16px", background: view === "about" ? "#2E75B622" : "transparent", color: view === "about" ? "#2E75B6" : "#8899aa", border: "1px solid #1e3a5f", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}
              onClick={() => setView("about")}
            >
              About
            </button>
            <UserButton />
          </div>
        </nav>

        {view === "form" && (
          <ScenarioForm
            onSubmit={handleFormSubmit}
            onCompare={handleStartComparison}
          />
        )}

        {view === "results" && results && (
          <ResultsPanel
            results={results}
            narrative={narrative}
            onReset={handleReset}
            onCompare={handleCompareFromResults}
          />
        )}

        {view === "comparison-form" && (
          <ScenarioForm
            onSubmit={handleComparisonSubmit}
            isComparisonMode={true}
            lockedSlot={getLockedSlot()}
            lockingSlot={lockingSlot}
          />
        )}

        {view === "comparison" && slotA && slotB && (
        <ComparisonResults
          slotA={slotA}
          slotB={slotB}
          hasComparedOnce={hasComparedOnce}
          onChangeA={() => handleChangeSlot("A")}
          onChangeB={() => handleChangeSlot("B")}
          onReset={handleReset}
        />
      )}

        {view === "history" && (
          <ScenarioHistory
            onBack={() => setView("form")}
            onViewScenario={(sc) => {
              setResults(sc.results);
              setNarrative(sc.narrative || "");
              setView("results");
            }}
          />
        )}

        {view === "about" && (
          <AboutPage onBack={() => setView("form")} />
        )}
      </SignedIn>
    </div>
  );
}