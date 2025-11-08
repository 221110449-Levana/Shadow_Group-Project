exports.verifySecret = (s) => s === process.env.BACKEND_SECRET;

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
