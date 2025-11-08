const axios = require("axios");
const OpenAI = require("openai");
const { writeResultsToSheet } = require("./sheets");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const SHEET_ID = process.env.GOOGLE_SHEETS_ID;

// 🔹 Fungsi untuk memformat angka dengan titik ribuan (tanpa pembulatan)
function formatNumber(n) {
  if (!n) return "-";
  return Number(n).toLocaleString("id-ID"); // contoh: 1234567 → "1.234.567"
}

// 🔹 Ambil detail video dari YouTube API
async function getYouTubeData(videoId) {
  const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,statistics&key=${YOUTUBE_API_KEY}`;
  const res = await axios.get(url);
  const video = res.data.items[0];

  if (!video) throw new Error("Video tidak ditemukan.");

  return {
    title: video.snippet.title,
    views: formatNumber(video.statistics.viewCount),
    likes: formatNumber(video.statistics.likeCount),
    comments: formatNumber(video.statistics.commentCount)
  };
}

// 🔹 Analisis video dengan OpenAI (ringkasan + sentimen)
async function analyzeVideo(title, description) {
  const prompt = `
Analisis video berikut:
Judul: ${title}
Deskripsi: ${description}

1. Buat ringkasan singkat dalam 1 paragraf bahasa Indonesia.
2. Tentukan sentimen video (Positive, Negative, atau Neutral).
Jawab dalam format JSON dengan field: summary, sentiment.
`;

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });

  let text = completion.choices[0].message.content.trim();

  // 🔹 Bersihkan hasil kalau ada ```json ... ```
  text = text.replace(/```json|```/g, "").trim();

  let jsonData;
  try {
    jsonData = JSON.parse(text);
  } catch {
    jsonData = { summary: text, sentiment: "Neutral" };
  }

  // 🔹 Normalisasi sentimen
  const sentiment = jsonData.sentiment
    ? jsonData.sentiment.charAt(0).toUpperCase() +
      jsonData.sentiment.slice(1).toLowerCase()
    : "Neutral";

  return {
    summary: jsonData.summary || text,
    sentiment
  };
}

// 🔹 Proses utama
async function processVideos(videoUrls) {
  const results = [];

  for (const url of videoUrls) {
    try {
      const videoId = new URL(url).searchParams.get("v") || url.split("/").pop();
      const ytData = await getYouTubeData(videoId);
      const aiResult = await analyzeVideo(ytData.title, "");

      const combined = {
        url,
        title: ytData.title,
        summary: aiResult.summary,
        sentiment: aiResult.sentiment,
        views: ytData.views,
        likes: ytData.likes,
        comments: ytData.comments
      };

      results.push(combined);
    } catch (err) {
      console.error("❌ Error processing:", url, err.message);
    }
  }

  if (results.length > 0) {
    await writeResultsToSheet(results);
  }

  return results;
}

module.exports = { processVideos };
