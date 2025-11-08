const axios = require("axios");

async function fetchVideoDetails(videoId, apiKey) {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`;
  const res = await axios.get(url);
  if (!res.data.items.length) throw new Error("Video tidak ditemukan");
  return res.data.items[0];
}

async function fetchTopComments(videoId, apiKey) {
  const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=20&order=relevance&textFormat=plainText&key=${apiKey}`;
  const res = await axios.get(url);
  return res.data.items.map(i => i.snippet.topLevelComment.snippet.textDisplay);
}

module.exports = { fetchVideoDetails, fetchTopComments };
