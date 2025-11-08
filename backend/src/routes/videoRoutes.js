// src/routes/videoRoutes.js
const express = require("express");
const { processVideos } = require("./controllers/process");
app.post("/api/process", processVideos);

const router = express.Router();

// POST /api/videos → analisis video
router.post("/videos", async (req, res) => {
  try {
    const { videoUrls } = req.body;
    const results = await processVideos(videoUrls);
    res.json({ ok: true, result: results });
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
