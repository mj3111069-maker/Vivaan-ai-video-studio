import express from "express";
import dotenv from "dotenv";
import { fal } from "@fal-ai/client";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json({ limit: "100kb" }));
app.use(express.static(path.join(__dirname, "public")));
if (process.env.FAL_KEY) fal.config({ credentials: process.env.FAL_KEY });
app.get("/api/health", (_req, res) => res.json({ ok: true, apiKeyConfigured: Boolean(process.env.FAL_KEY) }));
app.post("/api/generate", async (req, res) => {
  try {
    if (!process.env.FAL_KEY) return res.status(503).json({ error: "Server पर FAL_KEY सेट नहीं है।" });
    const { prompt, character = "Fictional realistic AI presenter", aspect_ratio = "9:16", resolution = "720p", duration = 5 } = req.body ?? {};
    if (typeof prompt !== "string" || !prompt.trim()) return res.status(400).json({ error: "Prompt required है।" });
    if (prompt.length > 5000) return res.status(400).json({ error: "Prompt 5000 characters से छोटा रखें।" });
    const allowedRatios = ["16:9", "9:16", "1:1", "4:3", "3:4"];
    if (!allowedRatios.includes(aspect_ratio)) return res.status(400).json({ error: "Aspect ratio invalid है।" });
    if (!["720p", "1080p"].includes(resolution)) return res.status(400).json({ error: "Resolution invalid है।" });
    const seconds = Number(duration);
    if (!Number.isInteger(seconds) || seconds < 2 || seconds > 15) return res.status(400).json({ error: "Duration 2 से 15 seconds के बीच चुनें।" });
    const fullPrompt = `${prompt.trim()} Character style: ${character}. Cinematic realistic visual quality, natural body movement, coherent scene, detailed lighting.`;
    const result = await fal.subscribe("fal-ai/wan/v2.7/text-to-video", {
      input: { prompt: fullPrompt, aspect_ratio, resolution, duration: String(seconds), enable_prompt_expansion: true, enable_safety_checker: true },
      logs: false
    });
    const videoUrl = result?.data?.video?.url;
    if (!videoUrl) return res.status(502).json({ error: "Provider ने video URL नहीं लौटाया।" });
    return res.json({ videoUrl, requestId: result.requestId ?? null });
  } catch (error) {
    console.error("Video generation error:", error?.message || error);
    return res.status(500).json({ error: "AI video generation में त्रुटि हुई। API key, credits/billing, model access जाँचें।" });
  }
});
const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`VIVAAN AI Video Studio running at http://localhost:${port}`));
