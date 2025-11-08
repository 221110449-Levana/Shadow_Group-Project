// src/services/ythelper.js
const axios = require("axios");
const { YOUTUBE_API_KEY } = require("../config/env");

/**
 * Ambil detail video dari YouTube API
 * @param {string} videoId
 * @returns {Promise<Object>}
 */
async function fetchVideoDetails(videoId) {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`;
  const res = await axios.get(url);

  if (!res.data.items.length) throw new Error("Video tidak ditemukan");
  return res.data.items[0];
}

/**
 * Ambil top comments video
 * @param {string} videoId
 * @returns {Promise<string[]>} array komentar
 */
async function fetchTopComments(videoId) {
  const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=20&order=relevance&textFormat=plainText&key=${YOUTUBE_API_KEY}`;
  const res = await axios.get(url);

  return res.data.items.map(
    (i) => i.snippet.topLevelComment.snippet.textDisplay
  );
}

module.exports = { fetchVideoDetails, fetchTopComments };
