require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { processVideos } = require("./process");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/process", async (req, res) => {
  try {
    if (req.headers["x-backend-secret"] !== process.env.BACKEND_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { videoUrls } = req.body;
    const result = await processVideos(videoUrls);

    res.json({ ok: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 4000, () => {
  console.log(`✅ Backend running at http://localhost:${process.env.PORT || 4000}`);
});

