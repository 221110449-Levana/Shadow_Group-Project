import React, { useState } from "react";

export default function VideoForm() {
  const [urls, setUrls] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const videoUrls = urls.split("\n").map((u) => u.trim()).filter(Boolean);
    if (videoUrls.length === 0) return;

    setLoading(true);
    setResults([]);

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrls }),
      });

      const data = await res.json();
      if (data.ok) setResults(data.result);
      else alert("Error: " + data.error);
    } catch (err) {
      alert("Gagal menghubungi backend: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 20 }}>
      <h2>🎬 YouTube Analyzer</h2>
      <h1>🎥 YouTube Analyzer – Kelompok 11</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={6}
          style={{ width: "100%", marginBottom: 10 }}
          placeholder="Masukkan URL video"
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "⏳ Sedang Memproses..." : "🚀 Mulai Analisis"}
        </button>
      </form>

      {results.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Hasil Analisis</h3>
          {results.map((r, i) => (
            <div key={i} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
              <a href={r.url} target="_blank" rel="noopener noreferrer"><strong>{r.title}</strong></a>
              <p><strong>Summary:</strong> {r.summary}</p>
              <p><strong>Sentiment:</strong> {r.sentiment}</p>
              <p><strong>Views:</strong> {r.views} | <strong>Likes:</strong> {r.likes} | <strong>Comments:</strong> {r.comments}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
