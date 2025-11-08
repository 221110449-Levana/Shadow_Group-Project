// src/controllers/process.js
const { getYouTubeData } = require("../services/yt");
const { fetchTopComments } = require("../services/yt_helpers");
const { cleanAIText, verifySecret, ytIdFromUrl } = require("../utils/utils");

/**
 * Endpoint POST /api/process
 */
async function processVideo(req, res) {
  try {
    const secret = req.headers["x-backend-secret"];
    if (!verifySecret(secret)) return res.status(401).json({ error: "Unauthorized" });

    const { videoUrls } = req.body;
    if (!videoUrls || !videoUrls.length) return res.status(400).json({ error: "No video URLs provided" });

    const results = [];

    for (const url of videoUrls) {
      const videoId = ytIdFromUrl(url);
      if (!videoId) {
        results.push({ url, error: "Invalid YouTube URL" });
        continue;
      }

      // Ambil data video
      const videoData = await getYouTubeData(videoId);

      // Ambil komentar top
      const comments = await fetchTopComments(videoId);
      const cleanComments = comments.map((c) => cleanAIText(c));

      results.push({
        url,
        videoData,
        comments: cleanComments,
      });
    }

    res.json({ results });
  } catch (err) {
    console.error("Error processing videos:", err.message);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { processVideo };

