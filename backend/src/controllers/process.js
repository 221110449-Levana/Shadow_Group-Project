// backend/api/process.js
import { getYouTubeData } from "../services/yt.js";
import { fetchTopComments } from "../services/yt_helpers.js";
import { cleanAIText, verifySecret, ytIdFromUrl } from "../utils/utils.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const secret = req.headers["x-backend-secret"];
    if (!verifySecret(secret)) return res.status(401).json({ error: "Unauthorized" });

    const { videoUrls } = req.body;
    if (!videoUrls || !videoUrls.length)
      return res.status(400).json({ error: "No video URLs provided" });

    const results = [];

    for (const url of videoUrls) {
      const videoId = ytIdFromUrl(url);
      if (!videoId) {
        results.push({ url, error: "Invalid YouTube URL" });
        continue;
      }

      const videoData = await getYouTubeData(videoId);

      const comments = await fetchTopComments(videoId);
      const cleanComments = comments.map((c) => cleanAIText(c));

      results.push({
        url,
        videoData,
        comments: cleanComments,
      });
    }

    res.status(200).json({ results });
  } catch (err) {
    console.error("Error processing videos:", err.message);
    res.status(500).json({ error: err.message });
  }
}
