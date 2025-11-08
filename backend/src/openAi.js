const axios = require("axios");

async function getSummariesForVideoBatch(videos) {
  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  const MODEL = process.env.OPENAI_MODEL;
  const results = [];

  for (const v of videos) {
    const prompt = `
Analisis video YouTube berikut:
Judul: ${v.title}
Deskripsi: ${v.description}
Komentar: ${v.topComments.slice(0, 5).join("\n")}

1. Buat ringkasan singkat (maks 70 kata).
2. Tentukan sentimen keseluruhan (Positive / Neutral / Negative).
Keluarkan output JSON {summary}.
`;

    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: MODEL,
        messages: [
          { role: "system", content: "Kamu adalah asisten analisis sentimen video YouTube." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3
      },
      { headers: { Authorization: `Bearer ${OPENAI_KEY}` } }
    );

    let text = res.data.choices[0].message.content.trim();
    try {
      results.push({ ...JSON.parse(text)});
    } catch {
      results.push({ summary: text, sentiment: "Neutral", });
    }
  }

  return results;
}

module.exports = { getSummariesForVideoBatch };
