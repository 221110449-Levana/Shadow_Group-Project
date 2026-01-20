// videoRoutes.js
const express = require("express");
const router = express.Router();

const { processVideos } = require("../services/processVideo");
const { verifySecret } = require("../utils/utils");

/**
 * POST /api/videos/process
 * Body:
 * {
 *   "videoUrls": ["https://www.youtube.com/watch?v=xxxx"]
 * }
 */
router.post("/process", async (req, res) => {
  try {
    // 1. Cek secret backend
    const secret = req.headers["x-backend-secret"];
    if (!verifySecret(secret)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 2. Validasi body
    const { videoUrls } = req.body;
    if (!Array.isArray(videoUrls) || videoUrls.length === 0) {
      return res.status(400).json({
        error: "videoUrls harus berupa array dan tidak boleh kosong",
      });
    }

    // 3. Proses video
    const results = await processVideos(videoUrls);

    // 4. Response
    res.json({
      success: true,
      total: results.length,
      results,
    });
  } catch (err) {
    console.error("❌ Route error:", err.message);
    res.status(500).json({ error: "Gagal memproses video" });
  }
});

module.exports = router;
