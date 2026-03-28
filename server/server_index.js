const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json({ limit: "10mb" })); // Allow large base64 images

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", hasApiKey: !!process.env.ANTHROPIC_API_KEY });
});

// Proxy endpoint for Claude API
app.post("/api/scan", async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "ANTHROPIC_API_KEY not set. Add it to your .env file.",
    });
  }

  try {
    const { imageBase64, mediaType } = req.body;

    if (!imageBase64 || !mediaType) {
      return res.status(400).json({ error: "Missing imageBase64 or mediaType" });
    }

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
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mediaType,
                  data: imageBase64,
                },
              },
              {
                type: "text",
                text: `You are an e-waste & recycling expert for Georgia State University. Identify this item and determine proper disposal. Respond ONLY with valid JSON (no markdown, no backticks, no extra text):
{
  "itemName": "name of the item",
  "category": "e-waste|recyclable|compost|landfill",
  "isEwaste": true or false,
  "disposal": "how to properly dispose of this item (1-2 sentences)",
  "whyMatters": "environmental impact if improperly disposed (1-2 sentences)",
  "hazard": "specific danger of throwing this in regular trash (1 sentence)",
  "stat1": { "value": "number+unit", "label": "short label" },
  "stat2": { "value": "number+unit", "label": "short label" },
  "binType": "what type of collection bin this needs"
}`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error:", response.status, errorText);
      return res.status(response.status).json({
        error: `Claude API returned ${response.status}`,
        details: errorText,
      });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    res.json(parsed);
  } catch (err) {
    console.error("Scan error:", err.message);
    res.status(500).json({ error: "Failed to analyze image", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🟢 EcoTrack API server running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
