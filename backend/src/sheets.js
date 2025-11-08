const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"]
});

const sheets = google.sheets({ version: "v4", auth });
const SHEET_ID = process.env.GOOGLE_SHEETS_ID;

async function writeResultsToSheet(results) {
  try {
    // 🔹 1. Ambil semua URL dari kolom B
    const existingUrlsRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "VideoData!B2:B"
    });

    const existingUrls = existingUrlsRes.data.values?.map((r) => r[0]) || [];

    // 🔹 2. Loop semua hasil analisis
    for (const r of results) {
      const normalizedUrl = (r.url || "").trim();

      // Cek apakah URL sudah ada di sheet
      const existingIndex = existingUrls.findIndex(
        (u) => (u || "").trim() === normalizedUrl
      );

      if (existingIndex !== -1) {
        // 🟡 3. Jika sudah ada, update baris yang sama
        const rowNumber = existingIndex + 2; // +2 karena header di baris 1
        const values = [
          [
            rowNumber - 1, // Kolom A (No)
            r.url,          // Kolom B (URL)
            r.title,        // Kolom C (Judul)
            r.summary,      // Kolom D (Ringkasan)
            r.sentiment,    // Kolom E (Sentimen)
            r.views,        // Kolom F (Views)
            r.likes,        // Kolom G (Likes)
            r.comments      // Kolom H (Comments)
          ]
        ];

        await sheets.spreadsheets.values.update({
          spreadsheetId: SHEET_ID,
          range: `VideoData!A${rowNumber}:H${rowNumber}`,
          valueInputOption: "RAW",
          requestBody: { values }
        });

        console.log(`♻️ Data diperbarui untuk URL: ${r.url}`);
      } else {
        // 🟢 4. Jika belum ada, tambahkan ke baris baru
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
            r.comments
          ]
        ];

        await sheets.spreadsheets.values.append({
          spreadsheetId: SHEET_ID,
          range: "VideoData!A2:H",
          valueInputOption: "RAW",
          requestBody: { values }
        });

        console.log(`✅ Data baru ditambahkan untuk URL: ${r.url}`);
        existingUrls.push(r.url); // Tambahkan ke daftar agar deteksi berikutnya tidak double
      }
    }

    console.log("🎯 Proses update/insert selesai!");
  } catch (err) {
    console.error("❌ Gagal menulis ke Sheet:", err.message);
  }
}

module.exports = { writeResultsToSheet };
