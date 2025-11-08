// src/config/sheets.js
const { google } = require("googleapis");
const { GOOGLE_SHEETS_ID, GOOGLE_SERVICE_ACCOUNT_KEY_PATH } = require("./env");

const auth = new google.auth.GoogleAuth({
  keyFile: GOOGLE_SERVICE_ACCOUNT_KEY_PATH,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

async function writeResultsToSheet(results) {
  try {
    const existingUrlsRes = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEETS_ID,
      range: "VideoData!B2:B",
    });

    const existingUrls = existingUrlsRes.data.values?.map((r) => (r[0] || "").trim()) || [];

    for (const r of results) {
      const normalizedUrl = (r.url || "").trim();
      const existingIndex = existingUrls.findIndex((u) => (u || "").trim() === normalizedUrl);

      if (existingIndex !== -1) {
        const rowNumber = existingIndex + 2;
        const values = [
          [
            rowNumber - 1,
            r.url,
            r.title,
            r.summary,
            r.sentiment,
            r.views,
            r.likes,
            r.comments,
          ],
        ];
        await sheets.spreadsheets.values.update({
          spreadsheetId: GOOGLE_SHEETS_ID,
          range: `VideoData!A${rowNumber}:H${rowNumber}`,
          valueInputOption: "RAW",
          requestBody: { values },
        });
        console.log(`♻️ Data diperbarui untuk: ${r.url}`);
      } else {
        const startRow = (existingUrls.length || 0) + 2;
        const values = [
          [
            startRow - 1,
            r.url,
            r.title,
            r.summary,
            r.sentiment,
            r.views,
            r.likes,
            r.comments,
          ],
        ];
        await sheets.spreadsheets.values.append({
          spreadsheetId: GOOGLE_SHEETS_ID,
          range: "VideoData!A2:H",
          valueInputOption: "RAW",
          requestBody: { values },
        });
        existingUrls.push(r.url);
        console.log(`✅ Data baru ditambahkan: ${r.url}`);
      }
    }
    console.log("🎯 Proses update/insert selesai!");
  } catch (err) {
    console.error("❌ Gagal menulis ke Sheet:", err.message);
  }
}

module.exports = { writeResultsToSheet };
