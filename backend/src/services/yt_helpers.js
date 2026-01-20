// yt_helpers.js
const axios = require("axios");
const { YOUTUBE_API_KEY } = require("../config/env");

/**
 * Ambil detail video dari YouTube API
 */
async function fetchVideoDetails(videoId) {
  const res = await axios.get(
    "https://www.googleapis.com/youtube/v3/videos",
    {
      params: {
        part: "snippet,statistics",
        id: videoId,
        key: YOUTUBE_API_KEY,
      },
    }
  );

  if (!res.data.items || res.data.items.length === 0) {
    throw new Error("Video tidak ditemukan");
  }

  return res.data.items[0];
}

/**
 * Ambil komentar PALING POPULER
 * hasil berupa ARRAY STRING
 */
async function fetchTopComments(videoId, limit = 5, maxFetch = 1000) {
  let comments = [];
  let nextPageToken = null;

  try {
    do {
      const res = await axios.get(
        "https://www.googleapis.com/youtube/v3/commentThreads",
        {
          params: {
            part: "snippet",
            videoId,
            maxResults: 100,        // maksimum per request
            pageToken: nextPageToken,
            textFormat: "plainText",
            key: YOUTUBE_API_KEY,
          },
        }
      );

      const items = res.data.items || [];

      for (const item of items) {
        const snippet = item.snippet.topLevelComment.snippet;

        comments.push({
          text: snippet.textDisplay,
          likes: snippet.likeCount || 0,
        });
      }

      nextPageToken = res.data.nextPageToken;

      // 🔴 SAFETY LIMIT (hindari quota jebol)
      if (comments.length >= maxFetch) break;

    } while (nextPageToken);

    // 🔥 SORT LIKE TERBANYAK
    return comments
      .filter(c => c.text && c.text.trim() !== "")
      .sort((a, b) => b.likes - a.likes)
      .slice(0, limit)
      .map(c => c.text);

  } catch (err) {
    console.error("❌ Gagal ambil semua komentar:", err.message);
    return [];
  }
}


module.exports = {
  fetchVideoDetails,
  fetchTopComments,
};