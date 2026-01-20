// frontend /App.js
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

    try {
      const res = await triggerProcess(videoUrls);
      setResults(Array.isArray(res.results) ? res.results : []);
    } catch (err) {
      console.error(err);
      alert("Gagal memproses video");
    }

    setLoading(false);
  };

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar">
        <h2 className="navbar-title">🎬 YouTube Analyzer</h2>
      </nav>

      <div className="container">
        <h1>🎥 YouTube Analyzer – Kelompok 11</h1>

        <form onSubmit={handleSubmit}>
          <textarea
            rows="6"
            placeholder="Masukkan link YouTube (1 link per baris)"
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
          />
          <button disabled={loading}>
            {loading ? "⏳ Sedang Memproses..." : "🚀 Mulai Analisis"}
          </button>
        </form>

        {/* HASIL */}
        {results.length > 0 && (
          <div>
            <h3 style={{ marginTop: "20px" }}>📊 Hasil Analisis:</h3>

            {results.map((r, i) => (
              <div key={i} className="result-card">
                {r.error ? (
                  <p style={{ color: "red" }}>
                    ❌ Error: {r.error}
                  </p>
                ) : (
                  <>
                    <p><b>URL:</b> <a href={r.url} target="_blank" rel="noreferrer">{r.url}</a></p>
                    <p><b>title:</b> {r.title}</p>
                    <p><b>Summary:</b> {r.summary}</p>
                    <p><b>Sentimen:</b> {r.sentiment}</p>
                    <p><b>Confidence:</b> {r.confidence}%</p>
                    <p><b>Views:</b> {r.views}</p>
                    <p><b>Likes:</b> {r.likes}</p>
                    <p><b>comments:</b> {r.commentsCount}</p>

                    <p><b>Top Komentar:</b></p>
                    <ul>
                      {Array.isArray(r.topComments) && r.topComments.length > 0 ? (
                        r.topComments.map((c, idx) => (
                          <li key={idx}>{c}</li>
                        ))
                      ) : (
                        <li>● Tidak ada komentar</li>
                      )}
                    </ul>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
