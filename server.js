// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());           // Enable CORS
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve your HTML/CSS/JS

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { messages, model } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages array" });
    }

    const response = await openai.chat.completions.create({
      model: model || "gpt-5",
      messages
    });

    res.json(response);
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Image generation endpoint
app.post("/image", async (req, res) => {
  try {
    const { prompt, size } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: size || "1024x1024",
      n: 1
    });

    if (!response.data || !response.data[0] || !response.data[0].url) {
      return res.status(500).json({ error: "No image returned from OpenAI" });
    }

    res.json({ url: response.data[0].url });
  } catch (err) {
    console.error("Image generation error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
