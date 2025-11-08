// src/services/yt.js
const axios = require("axios");
const { formatNumber } = require("../utils/utils");
const { YOUTUBE_API_KEY } = require("../config/env");

/**
 * Ambil data video dari YouTube API
 * @param {string} videoId
 * @returns {Promise<Object>} { title, views, likes, comments }
 */
async function getYouTubeData(videoId) {
  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,statistics&key=${YOUTUBE_API_KEY}`;
    const res = await axios.get(url);

    const video = res.data.items[0];
    if (!video) throw new Error("Video tidak ditemukan.");

    return {
      title: video.snippet.title,
      views: formatNumber(video.statistics.viewCount),
      likes: formatNumber(video.statistics.likeCount),
      comments: formatNumber(video.statistics.commentCount),
    };
  } catch (error) {
    console.error("Error fetching YouTube data:", error.message);
    throw error;
  }
}

module.exports = { getYouTubeData };
