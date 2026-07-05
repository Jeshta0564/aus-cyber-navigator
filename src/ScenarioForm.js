import { useState, useRef } from "react";

const SECTORS = [
  { value: "financial_services", label: "Financial Services (Bank / ADI / Insurer / Super Fund)" },
  { value: "critical_infrastructure", label: "Critical Infrastructure (Energy / Water / Transport / Health / Telco)" },
  { value: "health", label: "Health Care Provider / Hospital" },
  { value: "government", label: "Government Agency" },
  { value: "education", label: "Education / University" },
  { value: "general_business", label: "General Business / SME" },
];

const INCIDENT_TYPES = [
  { value: "ransomware", label: "Ransomware" },
  { value: "data_breach", label: "Data Breach / Unauthorised Access" },
  { value: "bec", label: "Business Email Compromise (BEC)" },
  { value: "insider_threat", label: "Insider Threat" },
  { value: "ddos", label: "DDoS / Availability Attack" },
  { value: "supply_chain", label: "Supply Chain Compromise" },
  { value: "other", label: "Other" },
];

const DATA_TYPES = [
  { value: "health", label: "Health / Medical Records" },
  { value: "financial", label: "Financial / Account Details" },
  { value: "government_id", label: "Government Identifiers (TFN, Medicare, Passport)" },
  { value: "location", label: "Location Data" },
  { value: "credentials", label: "Login Credentials / Passwords" },
  { value: "name_email_only", label: "Name and Email Only" },
];

const styles = {
  container: {
    maxWidth: "760px",
    margin: "0 auto",
    padding: "48px 24px",
  },
  sectionTitle: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#2E75B6",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    marginBottom: "28px",
    paddingBottom: "10px",
    borderBottom: "1px solid #1e3a5f",
  },
  card: {
    background: "#111e2d",
    border: "1px solid #1e3a5f",
    borderRadius: "8px",
    padding: "32px",
    marginBottom: "24px",
  },
  cardError: {
    background: "#111e2d",
    border: "1px solid #8B1A1A",
    borderRadius: "8px",
    padding: "32px",
    marginBottom: "24px",
  },
  questionBlock: {
    marginBottom: "40px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    color: "#ffffff",
    marginBottom: "8px",
    fontWeight: "600",
    lineHeight: "1.5",
  },
  labelError: {
    display: "block",
    fontSize: "14px",
    color: "#ff6b6b",
    marginBottom: "8px",
    fontWeight: "600",
    lineHeight: "1.5",
  },
  explanation: {
    fontSize: "12px",
    color: "#6a8099",
    marginBottom: "14px",
    lineHeight: "1.8",
    background: "#0a1520",
    borderLeft: "3px solid #1e3a5f",
    padding: "10px 14px",
    borderRadius: "0 4px 4px 0",
  },
  unsureNote: {
    marginTop: "10px",
    padding: "10px 14px",
    background: "#7A4F0011",
    border: "1px solid #7A4F00",
    borderRadius: "6px",
    fontSize: "12px",
    color: "#ffaa44",
    lineHeight: "1.6",
  },
  errorNote: {
    marginTop: "8px",
    padding: "8px 14px",
    background: "#8B1A1A22",
    border: "1px solid #8B1A1A",
    borderRadius: "6px",
    fontSize: "12px",
    color: "#ff6b6b",
  },
  select: {
    width: "100%",
    background: "#0f1923",
    border: "1px solid #1e3a5f",
    borderRadius: "6px",
    color: "#ffffff",
    padding: "11px 12px",
    fontSize: "14px",
    outline: "none",
    cursor: "pointer",
  },
  selectError: {
    width: "100%",
    background: "#0f1923",
    border: "1px solid #8B1A1A",
    borderRadius: "6px",
    color: "#ffffff",
    padding: "11px 12px",
    fontSize: "14px",
    outline: "none",
    cursor: "pointer",
  },
  toggle: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  toggleBtn: (active, color) => ({
    padding: "9px 22px",
    borderRadius: "6px",
    border: `1px solid ${active ? color : "#1e3a5f"}`,
    background: active ? color + "22" : "transparent",
    color: active ? color : "#8899aa",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: active ? "600" : "400",
    transition: "all 0.15s",
  }),
  checkboxGroup: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  checkboxLabel: (checked) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: checked ? "#2E75B622" : "#0f1923",
    border: `1px solid ${checked ? "#2E75B6" : "#1e3a5f"}`,
    borderRadius: "6px",
    padding: "10px 14px",
    cursor: "pointer",
    fontSize: "13px",
    color: checked ? "#ffffff" : "#ccd6e0",
    transition: "all 0.15s",
  }),
  errorBanner: {
    background: "#8B1A1A22",
    border: "1px solid #8B1A1A",
    borderRadius: "8px",
    padding: "16px 20px",
    marginBottom: "24px",
    fontSize: "13px",
    color: "#ff6b6b",
    lineHeight: "1.6",
  },
  submitBtn: (enabled) => ({
    width: "100%",
    padding: "15px",
    background: enabled ? "#2E75B6" : "#1e3a5f",
    color: enabled ? "#fff" : "#556677",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px",
    letterSpacing: "0.3px",
    transition: "background 0.2s",
  }),
};

function YesNoUnsure({ value, onChange, yesLabel = "YES", noLabel = "NO", hasError }) {
  return (
    <div>
      <div style={{ ...styles.toggle, ...(hasError ? { gap: "10px" } : {}) }}>
        <button
          style={styles.toggleBtn(value === true, "#1A6B3A")}
          onClick={() => onChange(true)}
        >{yesLabel}</button>
        <button
          style={styles.toggleBtn(value === false, "#8B1A1A")}
          onClick={() => onChange(false)}
        >{noLabel}</button>
        <button
          style={styles.toggleBtn(value === "unsure", "#7A4F00")}
          onClick={() => onChange("unsure")}
        >I'm not sure</button>
      </div>
      {value === "unsure" && (
        <div style={styles.unsureNote}>
          The engine will treat this conservatively - assuming the obligation may apply
          and flagging it for further assessment. This is the correct regulatory approach:
          when in doubt, assume the threshold may be met and seek legal advice.
        </div>
      )}
      {hasError && (
        <div style={styles.errorNote}>
          This question requires an answer before you can continue.
        </div>
      )}
    </div>
  );
}

function Question({ id, label, explanation, children, hasError }) {
  return (
    <div id={id} style={styles.questionBlock}>
      <label style={hasError ? styles.labelError : styles.label}>{label}</label>
      {explanation && <div style={styles.explanation}>{explanation}</div>}
      {children}
    </div>
  );
}

export default function ScenarioForm({ onSubmit }) {
  const [form, setForm] = useState({
    sector: "",
    incidentType: "",
    isResponsibleEntity: null,
    isAPRARegulated: null,
    isASXListed: null,
    isAFSLHolder: null,
    cyberIncidentOccurred: true,
    significantAvailabilityImpact: null,
    relevantImpact: null,
    materialIncident: null,
    controlWeaknessIdentified: null,
    criticalOperationsDisrupted: null,
    personalInformationInvolved: null,
    unauthorisedAccessOrDisclosure: null,
    dataTypes: [],
    dataEncrypted: null,
    recipientType: "",
    vulnerableIndividuals: null,
    ransomPaidWithAssurances: null,
    materialToMarket: null,
  });

  const [errors, setErrors] = useState({});
  const [showErrorBanner, setShowErrorBanner] = useState(false);
  const containerRef = useRef(null);

  const set = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: false }));
  };

  const toggleDataType = (val) => {
    setForm(prev => ({
      ...prev,
      dataTypes: prev.dataTypes.includes(val)
        ? prev.dataTypes.filter(d => d !== val)
        : [...prev.dataTypes, val]
    }));
  };

  // Convert unsure to true conservatively for the engine
  const normalise = (val) => {
    if (val === "unsure") return true;
    return val;
  };

  const validate = () => {
    const newErrors = {};
    const required = [
      "sector", "incidentType", "isResponsibleEntity", "isAPRARegulated",
      "isASXListed", "isAFSLHolder", "significantAvailabilityImpact",
      "relevantImpact", "materialIncident", "controlWeaknessIdentified",
      "criticalOperationsDisrupted", "materialToMarket", "personalInformationInvolved"
    ];

    required.forEach(key => {
      if (form[key] === null || form[key] === "") {
        newErrors[key] = true;
      }
    });

    if (form.personalInformationInvolved === true || form.personalInformationInvolved === "unsure") {
      if (form.unauthorisedAccessOrDisclosure === null) newErrors.unauthorisedAccessOrDisclosure = true;
      if (form.dataEncrypted === null) newErrors.dataEncrypted = true;
      if (!form.recipientType) newErrors.recipientType = true;
      if (form.vulnerableIndividuals === null) newErrors.vulnerableIndividuals = true;
      if (form.ransomPaidWithAssurances === null) newErrors.ransomPaidWithAssurances = true;
    }

    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShowErrorBanner(true);
      // Scroll to first error
      const firstErrorKey = Object.keys(newErrors)[0];
      const el = document.getElementById(`q-${firstErrorKey}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Normalise unsure values before passing to engine
    const normalisedForm = {
      ...form,
      isResponsibleEntity: normalise(form.isResponsibleEntity),
      isAPRARegulated: normalise(form.isAPRARegulated),
      isASXListed: normalise(form.isASXListed),
      isAFSLHolder: normalise(form.isAFSLHolder),
      significantAvailabilityImpact: normalise(form.significantAvailabilityImpact),
      relevantImpact: normalise(form.relevantImpact),
      materialIncident: normalise(form.materialIncident),
      controlWeaknessIdentified: normalise(form.controlWeaknessIdentified),
      criticalOperationsDisrupted: normalise(form.criticalOperationsDisrupted),
      materialToMarket: normalise(form.materialToMarket),
      personalInformationInvolved: normalise(form.personalInformationInvolved),
      unauthorisedAccessOrDisclosure: normalise(form.unauthorisedAccessOrDisclosure),
      dataEncrypted: normalise(form.dataEncrypted),
      vulnerableIndividuals: normalise(form.vulnerableIndividuals),
      ransomPaidWithAssurances: normalise(form.ransomPaidWithAssurances),
    };

    onSubmit(normalisedForm);
  };

  const piRequired = form.personalInformationInvolved === true ||
    form.personalInformationInvolved === "unsure";

  return (
    <div style={styles.container} ref={containerRef}>
      <h2 style={{ color: "#fff", fontSize: "22px", marginBottom: "6px" }}>
        Incident Scenario Input
      </h2>
      <p style={{ color: "#556677", fontSize: "13px", marginBottom: "36px", lineHeight: "1.6" }}>
        Answer each question based on your organisation and the incident. Each question
        includes a plain-English explanation. If you are unsure about an answer, select
        "I'm not sure" - the engine will handle it conservatively.
      </p>

      {showErrorBanner && (
        <div style={styles.errorBanner}>
          Some questions have not been answered. The unanswered questions are highlighted
          in red below. Please complete them before running the engine.
        </div>
      )}

      {/* SECTION 1 - Organisation Profile */}
      <div style={errors.sector || errors.isResponsibleEntity ? styles.cardError : styles.card}>
        <div style={styles.sectionTitle}>Section 1 - Organisation Profile</div>

        <Question
          id="q-sector"
          label="What sector does your organisation operate in?"
          explanation="Select the primary sector your organisation belongs to. This determines which regulatory frameworks apply to you. If your organisation spans multiple sectors, select the one most relevant to this incident."
          hasError={errors.sector}
        >
          <select
            style={errors.sector ? styles.selectError : styles.select}
            value={form.sector}
            onChange={e => set("sector", e.target.value)}
          >
            <option value="">-- Select sector --</option>
            {SECTORS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          {errors.sector && <div style={styles.errorNote}>Please select a sector.</div>}
        </Question>

        <Question
          id="q-isResponsibleEntity"
          label="Is your organisation a Responsible Entity under the SOCI Act?"
          explanation="The Security of Critical Infrastructure Act 2018 covers organisations that own or operate assets in 11 critical sectors: communications, data storage, defence industry, education and research, energy, financial services, food and grocery, health care, space technology, transport, and water. If your organisation runs infrastructure in any of these sectors - such as a power network, hospital system, or a telco network - you are likely a Responsible Entity. If you are unsure, select 'I'm not sure' and the engine will flag it for legal review."
          hasError={errors.isResponsibleEntity}
        >
          <YesNoUnsure
            value={form.isResponsibleEntity}
            onChange={v => set("isResponsibleEntity", v)}
            hasError={errors.isResponsibleEntity}
          />
        </Question>

        <Question
          id="q-isAPRARegulated"
          label="Is your organisation APRA-regulated?"
          explanation="The Australian Prudential Regulation Authority (APRA) regulates banks, credit unions, building societies, general insurers, life insurers, private health insurers, and superannuation fund trustees. If your organisation holds a banking licence, an insurance licence, or manages a super fund on behalf of members, you are APRA-regulated and subject to CPS 234 information security obligations. Most other businesses are not APRA-regulated."
          hasError={errors.isAPRARegulated}
        >
          <YesNoUnsure
            value={form.isAPRARegulated}
            onChange={v => set("isAPRARegulated", v)}
            hasError={errors.isAPRARegulated}
          />
        </Question>

        <Question
          id="q-isASXListed"
          label="Is your organisation listed on the Australian Securities Exchange (ASX)?"
          explanation="ASX-listed companies have continuous disclosure obligations under the Corporations Act 2001. This means if a cyber incident is likely to materially affect your share price or the value of your securities, you must disclose it to the market immediately. If your organisation is privately held, this obligation does not apply."
          hasError={errors.isASXListed}
        >
          <YesNoUnsure
            value={form.isASXListed}
            onChange={v => set("isASXListed", v)}
            hasError={errors.isASXListed}
          />
        </Question>

        <Question
          id="q-isAFSLHolder"
          label="Does your organisation hold an Australian Financial Services Licence (AFSL)?"
          explanation="An AFSL is required to provide financial services in Australia - such as financial advice, dealing in financial products, or operating a managed investment scheme. AFSL holders have specific ASIC obligations that may be triggered by a significant cyber incident. If you are unsure, check your organisation's licence register or select 'I'm not sure'."
          hasError={errors.isAFSLHolder}
        >
          <YesNoUnsure
            value={form.isAFSLHolder}
            onChange={v => set("isAFSLHolder", v)}
            hasError={errors.isAFSLHolder}
          />
        </Question>
      </div>

      {/* SECTION 2 - Incident Characteristics */}
      <div style={styles.card}>
        <div style={styles.sectionTitle}>Section 2 - Incident Characteristics</div>

        <Question
          id="q-incidentType"
          label="What type of incident has occurred?"
          explanation="Select the category that best describes the nature of the cyber incident. This provides context for the obligation assessment. If multiple types apply, select the primary one."
          hasError={errors.incidentType}
        >
          <select
            style={errors.incidentType ? styles.selectError : styles.select}
            value={form.incidentType}
            onChange={e => set("incidentType", e.target.value)}
          >
            <option value="">-- Select incident type --</option>
            {INCIDENT_TYPES.map(i => (
              <option key={i.value} value={i.value}>{i.label}</option>
            ))}
          </select>
          {errors.incidentType && <div style={styles.errorNote}>Please select an incident type.</div>}
        </Question>

        <Question
          id="q-significantAvailabilityImpact"
          label="Has the incident caused a SIGNIFICANT impact on the availability of a critical infrastructure asset?"
          explanation="A significant availability impact means the incident has materially disrupted - or is likely to materially disrupt - the provision of essential goods or services. Examples: a hospital patient management system is offline, a power network cannot dispatch electricity, or a bank's core banking platform is inaccessible. This triggers the 12-hour mandatory notification window under the SOCI Act - the shortest regulatory deadline in Australian law. If you are not sure whether the impact qualifies as significant, select 'I'm not sure' and the engine will apply the conservative 12-hour obligation."
          hasError={errors.significantAvailabilityImpact}
        >
          <YesNoUnsure
            value={form.significantAvailabilityImpact}
            onChange={v => set("significantAvailabilityImpact", v)}
            yesLabel="YES - availability materially disrupted"
            noLabel="NO - not significantly affected"
            hasError={errors.significantAvailabilityImpact}
          />
        </Question>

        <Question
          id="q-relevantImpact"
          label="Does the incident have a RELEVANT impact on the critical infrastructure asset?"
          explanation="A relevant impact is broader than availability disruption. It includes any impact on integrity (data has been altered or tampered with), reliability (systems are not performing as expected), or confidentiality (data has been accessed without authorisation) of the asset - even if the asset is still technically available. This triggers the 72-hour notification window under the SOCI Act."
          hasError={errors.relevantImpact}
        >
          <YesNoUnsure
            value={form.relevantImpact}
            onChange={v => set("relevantImpact", v)}
            yesLabel="YES - integrity / reliability / confidentiality affected"
            noLabel="NO - no relevant impact"
            hasError={errors.relevantImpact}
          />
        </Question>

        <Question
          id="q-materialIncident"
          label="Does this incident constitute a MATERIAL information security incident for APRA purposes?"
          explanation="Under CPS 234, a material incident is one that has materially affected - or has the potential to materially affect - the entity's financial interests or its ability to manage its information assets. Consider: has the incident disrupted core operations such as banking, insurance processing, or superannuation management? Has it compromised systems holding significant financial or customer data? When in doubt, APRA has stated it prefers over-notification to missed notifications. Select 'I'm not sure' if you are uncertain - the engine will apply the conservative 72-hour notification."
          hasError={errors.materialIncident}
        >
          <YesNoUnsure
            value={form.materialIncident}
            onChange={v => set("materialIncident", v)}
            hasError={errors.materialIncident}
          />
        </Question>

        <Question
          id="q-controlWeaknessIdentified"
          label="Has the incident revealed a material information security control weakness?"
          explanation="Separate from the incident itself - has the investigation uncovered a gap in your security controls that could materially affect your information assets? For example: a misconfigured firewall, an unpatched system that was exposed, or an access control gap. This triggers a separate 10 business day notification obligation to APRA under CPS 234 - independent of the incident notification itself."
          hasError={errors.controlWeaknessIdentified}
        >
          <YesNoUnsure
            value={form.controlWeaknessIdentified}
            onChange={v => set("controlWeaknessIdentified", v)}
            hasError={errors.controlWeaknessIdentified}
          />
        </Question>

        <Question
          id="q-criticalOperationsDisrupted"
          label="Have critical business operations been disrupted?"
          explanation="Critical operations are the services your organisation must continue to deliver even during a disruption - such as processing payments, settling trades, or managing insurance claims. This relates to APRA CPS 230 operational resilience obligations. If your Business Continuity Plan has been activated, or if a core business function is unavailable, answer YES."
          hasError={errors.criticalOperationsDisrupted}
        >
          <YesNoUnsure
            value={form.criticalOperationsDisrupted}
            onChange={v => set("criticalOperationsDisrupted", v)}
            hasError={errors.criticalOperationsDisrupted}
          />
        </Question>

        <Question
          id="q-materialToMarket"
          label="Is this incident likely to materially affect your organisation's share price or investor decisions?"
          explanation="Under the Corporations Act 2001, ASX-listed entities must immediately disclose information that a reasonable person would expect to have a material effect on share price. This is determined by legal counsel and the CFO. Consider: will this incident affect revenue, customer confidence, or the organisation's ability to operate? If there is any doubt, involve legal counsel immediately - a delayed disclosure after materiality is established is itself a compliance breach."
          hasError={errors.materialToMarket}
        >
          <YesNoUnsure
            value={form.materialToMarket}
            onChange={v => set("materialToMarket", v)}
            hasError={errors.materialToMarket}
          />
        </Question>
      </div>

      {/* SECTION 3 - Personal Information */}
      <div style={styles.card}>
        <div style={styles.sectionTitle}>Section 3 - Personal Information Assessment</div>

        <Question
          id="q-personalInformationInvolved"
          label="Does the incident involve personal information of individuals?"
          explanation="Personal information is any information or opinion about an identified individual, or someone who is reasonably identifiable. This includes names, contact details, health information, financial records, government identifiers (TFN, Medicare number), location data, and login credentials. If any such information may have been accessed, disclosed, or lost during this incident, answer YES."
          hasError={errors.personalInformationInvolved}
        >
          <YesNoUnsure
            value={form.personalInformationInvolved}
            onChange={v => set("personalInformationInvolved", v)}
            hasError={errors.personalInformationInvolved}
          />
        </Question>

        {piRequired && (
          <>
            <Question
              id="q-unauthorisedAccessOrDisclosure"
              label="Has there been unauthorised access to, or disclosure of, personal information?"
              explanation="Unauthorised access means someone who should not have accessed the information did so. Unauthorised disclosure means personal information was released to an unintended recipient. This is Condition 1 of the three-condition test under the Notifiable Data Breaches scheme. If data was lost but no unauthorised access has occurred yet, this condition may still be met if such access is likely to occur."
              hasError={errors.unauthorisedAccessOrDisclosure}
            >
              <YesNoUnsure
                value={form.unauthorisedAccessOrDisclosure}
                onChange={v => set("unauthorisedAccessOrDisclosure", v)}
                hasError={errors.unauthorisedAccessOrDisclosure}
              />
            </Question>

            <Question
              id="q-dataTypes"
              label="What types of personal information are involved? Select all that apply."
              explanation="The type of data involved is a key factor in assessing whether serious harm to affected individuals is likely. Health, financial, and government identifier information are considered high sensitivity and significantly increase the likelihood of a serious harm finding under the NDB scheme. If you are unsure of the exact data types involved, select the most likely ones based on what systems were affected."
            >
              <div style={styles.checkboxGroup}>
                {DATA_TYPES.map(dt => (
                  <label
                    key={dt.value}
                    style={styles.checkboxLabel(form.dataTypes.includes(dt.value))}
                  >
                    <input
                      type="checkbox"
                      checked={form.dataTypes.includes(dt.value)}
                      onChange={() => toggleDataType(dt.value)}
                      style={{ accentColor: "#2E75B6" }}
                    />
                    {dt.label}
                  </label>
                ))}
              </div>
            </Question>

            <Question
              id="q-dataEncrypted"
              label="Was the personal information encrypted at the time of the incident?"
              explanation="If the data was encrypted and the encryption has not been broken, the attacker may not be able to read the information - which reduces the likelihood of serious harm. However, you must be able to confirm technically that the encryption is robust and intact. If you are unsure whether the data was encrypted, or whether the encryption was broken, select 'I'm not sure' - the engine will treat the data as accessible, which is the conservative and correct regulatory approach."
              hasError={errors.dataEncrypted}
            >
              <YesNoUnsure
                value={form.dataEncrypted}
                onChange={v => set("dataEncrypted", v)}
                yesLabel="YES - encrypted and unbroken"
                noLabel="NO - not encrypted or compromised"
                hasError={errors.dataEncrypted}
              />
            </Question>

            <Question
              id="q-recipientType"
              label="Who obtained or is likely to have obtained the personal information?"
              explanation="The identity and likely motivation of the recipient is a key factor in the serious harm assessment. A criminal attacker who has obtained financial or health data represents a high risk of harm. An accidental disclosure to a known and trusted internal party is treated as lower risk, though it still requires assessment. If you do not know who obtained the data, select 'Unknown' - the engine will treat this as elevated risk."
              hasError={errors.recipientType}
            >
              <div style={styles.toggle}>
                {[
                  { v: "criminal", l: "Criminal / Unknown Attacker" },
                  { v: "unknown", l: "Unknown" },
                  { v: "accidental_trusted", l: "Accidental - Trusted Party" },
                ].map(({ v, l }) => (
                  <button
                    key={v}
                    style={styles.toggleBtn(form.recipientType === v, "#2E75B6")}
                    onClick={() => set("recipientType", v)}
                  >
                    {l}
                  </button>
                ))}
              </div>
              {errors.recipientType && (
                <div style={styles.errorNote}>Please select who obtained the data.</div>
              )}
            </Question>

            <Question
              id="q-vulnerableIndividuals"
              label="Are any affected individuals in a vulnerable cohort?"
              explanation="Vulnerable individuals include children, people experiencing domestic violence (where location or contact data could create physical safety risks), elderly individuals, and people with mental illness. If your affected population includes any of these groups, the likelihood of a serious harm finding is elevated and the OAIC will scrutinise your assessment more closely. If you are unsure, select 'I'm not sure' and the engine will apply the elevated risk assumption."
              hasError={errors.vulnerableIndividuals}
            >
              <YesNoUnsure
                value={form.vulnerableIndividuals}
                onChange={v => set("vulnerableIndividuals", v)}
                hasError={errors.vulnerableIndividuals}
              />
            </Question>

            <Question
              id="q-ransomPaidWithAssurances"
              label="Has a ransom been paid and have the attackers provided assurances they will delete the data?"
              explanation="This is a critical point: the OAIC confirmed in its January to June 2024 report that attacker assurances - including written commitments to delete data - are NOT sufficient to conclude that serious harm is not likely. If you have paid a ransom and received assurances, the engine will still treat the data as being in attacker hands for the purposes of the serious harm assessment. This reflects OAIC's confirmed regulatory position and is not negotiable in the assessment logic."
              hasError={errors.ransomPaidWithAssurances}
            >
              <YesNoUnsure
                value={form.ransomPaidWithAssurances}
                onChange={v => set("ransomPaidWithAssurances", v)}
                hasError={errors.ransomPaidWithAssurances}
              />
            </Question>
          </>
        )}
      </div>

      <button
        style={styles.submitBtn(true)}
        onClick={handleSubmit}
      >
        Run Obligation Engine ->
      </button>
    </div>
  );
}