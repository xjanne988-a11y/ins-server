require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { initDB } = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

initDB();
console.log("[db] Database initialized");
// 自动填充种子数据
try { const _db = require("./db").getDB(); const _cnt = _db.prepare("SELECT COUNT(*) as c FROM bloggers").get(); if (_cnt.c === 0) { console.log("[seed] Empty DB, running seed..."); require("./seed-real"); } } catch(_e) { console.log("[seed] Auto-seed skipped:", _e.message); }

app.use("/api/bloggers", require("./routes/bloggers"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/stories", require("./routes/stories"));
app.use('/api/comments', require('./routes/comments'));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 媒体代理 - 小程序通过此接口获取 Instagram 媒体文件，无需翻墙
app.get("/api/proxy/image", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "url is required" });
  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";
    res.set("Content-Type", contentType);
    res.set("Cache-Control", "public, max-age=86400");
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(502).json({ error: "Failed to proxy media" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("[server] Instagram Mini Program API running at http://localhost:" + PORT);
  console.log("[server] Health check: http://localhost:" + PORT + "/api/health");
});


