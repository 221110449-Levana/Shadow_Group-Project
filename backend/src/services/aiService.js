// src/services/aiService.js
const openai = require("../config/openAi");
const { cleanAIText } = require("../utils/utils");

async function analyzeVideo(title, description, commentsText) {
  const prompt = `
Analisis video YouTube berikut:

Judul:
${title}

Deskripsi:
${description || "-"}

Top Komentar Penonton:
${commentsText || "-"}

Tugas:
1. Buat ringkasan isi video DAN reaksi penonton (1 paragraf bahasa Indonesia)
2. Tentukan sentimen keseluruhan (Positif / Netral / Negatif)
3. Tentukan tingkat kepercayaan analisis (0–100)

Jawab HANYA dalam format JSON berikut (tanpa markdown, tanpa teks tambahan):
{
  "summary": "string",
  "sentiment": "Positif | Netral | Negatif",
  "confidence": number
}
`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Kamu adalah sistem analisis sentimen. Output HARUS JSON MURNI tanpa ``` atau teks lain.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
  });

  let raw = cleanAIText(res.choices[0].message.content);

  // 🔥 Pastikan tidak ada markdown
  raw = raw.replace(/```json|```/g, "").trim();

  let result;
  try {
    result = JSON.parse(raw);
  } catch (err) {
    // 🛟 fallback aman
    result = {
      summary: raw,
      sentiment: "Netral",
      confidence: 50,
    };
  }

  // 🔒 Normalisasi sentiment
  const allowedSentiments = ["Positif", "Netral", "Negatif"];
  if (!allowedSentiments.includes(result.sentiment)) {
    result.sentiment = "Netral";
  }

  // 🔒 Normalisasi confidence
  if (
    typeof result.confidence !== "number" ||
    result.confidence < 0 ||
    result.confidence > 100
  ) {
    result.confidence = 50;
  }

  return {
    summary: result.summary || "",
    sentiment: result.sentiment,
    confidence: result.confidence,
  };
}

module.exports = { analyzeVideo };
