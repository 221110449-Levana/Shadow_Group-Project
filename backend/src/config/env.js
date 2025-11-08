// src/config/env.js
require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 4000,
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL || "gpt-4o-mini",
  GOOGLE_SHEETS_ID: process.env.GOOGLE_SHEETS_ID,
  GOOGLE_SERVICE_ACCOUNT_KEY_PATH: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH,
};
