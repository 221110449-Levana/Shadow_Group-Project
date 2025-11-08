// src/app.js
const express = require("express");
const cors = require("cors");
const { processVideo } = require("./controllers/process");

const app = express();

// Middleware
app.use(cors({ origin: "*" })); // ganti origin dengan frontend URL jika mau aman
app.use(express.json());

// Routes
app.post("/api/process", processVideo);

module.exports = app;
