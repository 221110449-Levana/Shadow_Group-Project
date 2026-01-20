// processVideo.js
const { getYouTubeData } = require("./yt");
const { fetchTopComments } = require("./yt_helpers");

const { analyzeVideo } = require("./aiService");
const { ytIdFromUrl, cleanAIText } = require("../utils/utils");
const { writeResultsToSheet } = require("../config/sheets");

async function processVideos(videoUrls) {
  const results = [];

  for (const url of videoUrls) {
    try {
      const videoId = ytIdFromUrl(url);
      if (!videoId) throw new Error("URL YouTube tidak valid");

      // ✅ Ambil data video
      const ytData = await getYouTubeData(videoId);

      // ✅ Ambil komentar paling populer
      const topComments = await fetchTopComments(videoId);

      const cleanComments = topComments
        .map(cleanAIText)
        .filter(Boolean)
        .slice(0, 5);


      // ✅ AI ANALYSIS
      const aiResult = await analyzeVideo(
        ytData.title,
        ytData.description || "",
        cleanComments.join("\n")
      );

      results.push({
        url,
        title: ytData.title,
        summary: aiResult.summary,
        sentiment: aiResult.sentiment,
        confidence: Number(aiResult.confidence),
        views: ytData.views,
        likes: ytData.likes,
        commentsCount: ytData.comments,
        topComments: topComments,
      });

    } catch (err) {
      console.error("❌ Error video:", err.message);
      results.push({ url, error: err.message });
    }
  }

  // ✅ PASTI DIPANGGIL
  console.log("📥 writeResultsToSheet dipanggil!");
  await writeResultsToSheet(results);

  return results;
}

module.exports = { processVideos };
