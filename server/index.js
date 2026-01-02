import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 4000;

// Simple health check
app.get("/", (_req, res) => res.json({ status: "ok" }));

app.post("/api/analyze", async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: "Missing image" });

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Server missing GOOGLE_API_KEY" });

    // Try to use the server-side SDK if available.
    try {
      const { GoogleGenAI } = await import("@google/genai");
      const client = new GoogleGenAI({ apiKey });

      const cleanBase64 = image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

      const prompt = `Analyze this image of a garbage bin. Determine if it is overflowing, estimate the fill percentage (0-100), identify visible waste types (plastic, organic, paper, metal, hazardous), and assess urgency. If you see fire, smoke, or leaking chemicals, mark as CRITICAL urgency and hazardous.`;

      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: {
          parts: [
            { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } },
            { text: prompt }
          ]
        },
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response?.text;
      if (!text) return res.status(500).json({ error: "Empty AI response" });

      const parsed = JSON.parse(text);
      return res.json(parsed);
    } catch (sdkErr) {
      // SDK not installed or runtime error. Return a helpful error and a safe fallback.
      console.error("Server SDK error:", sdkErr);
      return res.status(501).json({
        error: "Server GenAI SDK unavailable. Install @google/genai and set GOOGLE_API_KEY. Returning fallback result.",
        fallback: {
          overflowLevel: 60,
          wasteTypes: ["General Waste"],
          urgency: "MEDIUM",
          description: "SDK unavailable — fallback response.",
          isHazardous: false
        }
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
