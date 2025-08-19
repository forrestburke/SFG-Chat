// server.js
const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_API_KEY
}));

app.post("/generate-image", async (req, res) => {
    try {
        const { prompt, size } = req.body;
        if (!prompt) return res.status(400).json({ error: "Prompt is required" });

        const response = await openai.createImage({
            model: "gpt-image-1",
            prompt: prompt,
            n: 1,
            size: size || "1024x1024"
        });

        const imageUrl = response.data.data[0].url;
        res.json({ url: imageUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || "Unknown error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
