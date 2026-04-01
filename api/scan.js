export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "API key not set" });

  try {
    const { imageBase64, mediaType } = req.body;
    if (!imageBase64 || !mediaType) return res.status(400).json({ error: "Missing image data" });

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType, data: imageBase64 } },
            { type: "text", text: 'You are an e-waste & recycling expert for Georgia State University. Identify this item and determine proper disposal. Respond ONLY with valid JSON (no markdown, no backticks): {"itemName":"name","category":"e-waste|recyclable|compost|landfill","isEwaste":true or false,"disposal":"how to dispose (1-2 sentences)","whyMatters":"environmental impact (1-2 sentences)","hazard":"danger of wrong disposal (1 sentence)","stat1":{"value":"number+unit","label":"short label"},"stat2":{"value":"number+unit","label":"short label"},"binType":"bin type needed"}' },
          ],
        }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: "Claude API error", details: err });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";
    res.json(JSON.parse(text.replace(/```json|```/g, "").trim()));
  } catch (err) {
    res.status(500).json({ error: "Failed to analyze", details: err.message });
  }
}
