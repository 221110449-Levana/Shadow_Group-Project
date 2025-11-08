const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"]
});

const sheets = google.sheets({ version: "v4", auth });
const SHEET_ID = process.env.GOOGLE_SHEETS_ID;

async function writeResultsToSheet(results) {
  try {
    const existingUrlsRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "VideoData!B2:B"
    });

    const existingUrls = existingUrlsRes.data.values?.map(r => r[0].trim()) || [];

    for (const r of results) {
      const normalizedUrl = (r.url || "").trim();
      const existingIndex = existingUrls.indexOf(normalizedUrl);

      const values = [[
        '=ROW()-1',      
        r.url,           
        r.title,         
        r.summary,       
        r.sentiment,    
        r.views,        
        r.likes,         
        r.comments      
      ]];

      if (existingIndex !== -1) {
        // 🔹 Update baris yang sudah ada
        const rowNumber = existingIndex + 2; 
        await sheets.spreadsheets.values.update({
          spreadsheetId: SHEET_ID,
          range: `VideoData!A${rowNumber}:H${rowNumber}`,
          valueInputOption: "USER_ENTERED", 
          requestBody: { values }
        });
        console.log(`♻️ Data diperbarui untuk URL: ${r.url}`);
      } else {
        // 🔹 Tambahkan baris baru
        await sheets.spreadsheets.values.append({
          spreadsheetId: SHEET_ID,
          range: "VideoData!A:H",
          valueInputOption: "USER_ENTERED", 
          insertDataOption: "INSERT_ROWS",
          requestBody: { values }
        });
        console.log(`✅ Data baru ditambahkan untuk URL: ${r.url}`);
        existingUrls.push(normalizedUrl);
      }
    }

    console.log("🎯 Proses update/insert selesai!");
  } catch (err) {
    console.error("❌ Gagal menulis ke Sheet:", err.message);
  }
}

module.exports = { writeResultsToSheet };

