// src/config/openAi.js
const OpenAI = require("openai");
const { cleanAIText } = require("../utils/utils");
const { OPENAI_API_KEY, OPENAI_MODEL } = require("./env");

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

async function analyzeVideo(title, description) {
  const prompt = `
Analisis video berikut:
Judul: ${title}
Deskripsi: ${description}

1. Ringkas isi video dalam 1 paragraf bahasa Indonesia.
2. Tentukan sentimen: Positive, Neutral, atau Negative.
Jawab dalam format JSON dengan field: summary, sentiment.
`;

  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [{ role: "user", content: prompt }],
  });

  return cleanAIText(completion.choices[0].message.content);
}

module.exports = { analyzeVideo };
