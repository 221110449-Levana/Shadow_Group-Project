// sheets.js
const { google } = require("googleapis");
const { GOOGLE_SHEETS_ID, GOOGLE_SERVICE_ACCOUNT_KEY_PATH } = require("./env");

const auth = new google.auth.GoogleAuth({
  keyFile: GOOGLE_SERVICE_ACCOUNT_KEY_PATH,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

async function writeResultsToSheet(results) {
  console.log("📥 writeResultsToSheet dipanggil!");

  try {
    const existingRes = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEETS_ID,
      range: "VideoData!B2:J",
    });

    const existingUrls =
      existingRes.data.values?.map((r) => r[0]) || [];

    for (const r of results) {
      if (r.error) continue;

      const index = existingUrls.indexOf(r.url);

      const rowData = [
        "", // nomor
        r.url,
        r.title,
        r.summary,
        r.sentiment,
        r.views,
        r.likes,
        r.commentsCount,
        `${r.confidence}%`,
        (r.topComments || [])
        .map((c, i) => `• ${c}`)
        .join("\n"), // 🔵 bullet
      ];

      if (index !== -1) {
        const row = index + 2;
        rowData[0] = row - 1;

        await sheets.spreadsheets.values.update({
          spreadsheetId: GOOGLE_SHEETS_ID,
          range: `VideoData!A${row}:J${row}`,
          valueInputOption: "RAW",
          requestBody: { values: [rowData] },
        });

        console.log(`♻️ Update: ${r.url}`);
      } else {
        rowData[0] = existingUrls.length + 1;

        await sheets.spreadsheets.values.append({
          spreadsheetId: GOOGLE_SHEETS_ID,
          range: "VideoData!B2:J",
          valueInputOption: "RAW",
          requestBody: { values: [rowData] },
        });

        existingUrls.push(r.url);
        console.log(`✅ Insert: ${r.url}`);
      }
    }

    console.log("🎯 Sinkronisasi Google Sheets selesai!");
  } catch (err) {
    console.error("❌ Gagal menulis ke Google Sheets:", err.message);
  }
}

module.exports = { writeResultsToSheet };
