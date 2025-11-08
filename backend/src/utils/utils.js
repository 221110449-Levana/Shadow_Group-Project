// src/utils/utils.js

/**
 * Verifikasi secret key backend
 * @param {string} s
 * @returns {boolean}
 */
exports.verifySecret = (s) => s === process.env.BACKEND_SECRET;

/**
 * Ambil ID video dari URL YouTube
 * @param {string} url
 * @returns {string|null} videoId
 */
exports.ytIdFromUrl = (url) => {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    return url.split("/").pop();
  } catch {
    return null;
  }
};

/**
 * Format angka dengan ribuan (misal 12345 -> 12,345)
 * @param {string|number} num
 * @returns {string}
 */
exports.formatNumber = (num) => {
  if (!num) return "0";
  return Number(num).toLocaleString("en-US");
};

/**
 * Bersihkan teks hasil dari AI
 * - normalize newline
 * - hapus multiple newline
 * - trim spasi awal/akhir
 * @param {string} text
 * @returns {string}
 */
exports.cleanAIText = (text) => {
  if (!text) return "";
  return text
    .replace(/\r\n/g, "\n")      // normalize newline
    .replace(/\n{2,}/g, "\n")    // hapus multiple newline
    .trim();
};
