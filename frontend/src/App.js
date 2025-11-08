import React, { useState } from "react";
import { triggerProcess } from "./api";
import "./App.css";

function App() {
  const [urls, setUrls] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const videoUrls = urls
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);
    const res = await triggerProcess(videoUrls);
    setResults(res.result || []);
    setLoading(false);
  };

  return (
    <div>
      {/* === NAVBAR === */}
      <nav className="navbar">
        <h2 className="navbar-title">🎬 YouTube Analyzer</h2>
      </nav>
      <div className="container">
        <h1>🎥 YouTube Analyzer – Kelompok 11</h1>
        <form onSubmit={handleSubmit}>
          <textarea
            rows="6"
            placeholder="Masukkan link YouTube"
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
          />
          <button disabled={loading}>
            {loading ? "⏳ Sedang Memproses..." : "🚀 Mulai Analisis"}
          </button>
        </form>

        {results.length > 0 && (
          <div>
            <h3 style={{ marginTop: "20px" }}>📊 Hasil Analisis:</h3>
            {results.map((r, i) => (
              <div key={i} className="result-card">
                <p>
                  <b>URL:</b> <a href={r.url}>{r.url}</a>
                </p>
                <p>
                  <b>Judul:</b> {r.title}
                </p>
                <p>
                  <b>Ringkasan:</b> {r.summary}
                </p>
                <p>
                  <b>Sentimen:</b> {r.sentiment}
                </p>
                <p>
                  <b>Views:</b> {r.views}
                </p>
                <p>
                  <b>Likes:</b> {r.likes}
                </p>
                <p>
                  <b>Komentar:</b> {r.comments}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
