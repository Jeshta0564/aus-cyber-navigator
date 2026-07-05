export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { inputs, engineResults } = req.body;

  if (!engineResults) {
    return res.status(400).json({ error: "Missing engine results" });
  }

  const activeStreams = Object.values(engineResults.streams)
    .filter(s => s.applicable)
    .map(s => `${s.stream} (${s.deadline || "assess immediately"}): ${s.reasoning.join(" ")}`)
    .join("\n");

  const prompt = `You are a GRC analyst assistant. A decision engine has analysed a cyber incident scenario and determined the following Australian regulatory notification obligations:

${activeStreams}

Most urgent deadline: ${engineResults.summary.mostUrgentDeadline?.deadline || "None"} to ${engineResults.summary.mostUrgentDeadline?.regulator || "N/A"}

Write a single plain-English paragraph (4-6 sentences) summarising the regulatory situation for this incident. Be direct and specific. Mention the most time-critical obligation first. Do not use bullet points. Do not use dashes of any kind - use commas or full stops instead. Do not repeat all the details - focus on the overall picture and what the organisation needs to prioritise right now. End with a reminder that legal counsel should be engaged before making final notification decisions.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    if (data.content && data.content[0]) {
      return res.status(200).json({ narrative: data.content[0].text });
    } else {
      return res.status(500).json({ error: "No content returned from Claude" });
    }
  } catch (err) {
    console.error("Claude API error:", err);
    return res.status(500).json({ error: "Failed to generate narrative" });
  }
}