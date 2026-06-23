require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const data = require("./data");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Auto-seed if empty
const seed = require("./seed-real");
console.log("[seed]", "[db] Database initialized");

app.use("/api/bloggers", require("./routes/bloggers"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/stories", require("./routes/stories"));
app.use('/api/comments', require('./routes/comments'));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString(), bloggers: data.getBloggerCount(), posts: data.getPostCount() });
});

// Media proxy - serves Instagram images without VPN
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
