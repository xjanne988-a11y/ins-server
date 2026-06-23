const express = require("express");
const data = require("../data");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ bloggers: data.getAllBloggers() });
});

router.get("/:username", (req, res) => {
  const blogger = data.getBlogger(req.params.username);
  if (!blogger) return res.status(404).json({ error: "Blogger not found" });
  const posts = data.getPostsByBlogger(blogger.id);
  const stories = data.getStoriesByBlogger(blogger.id);
  res.json({ blogger, posts, stories });
});

router.post("/", async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "username is required" });
  try {
    const { execSync } = require("child_process");
    const path = require("path");
    const PYTHON_PATH = "C:\\Users\\X\\python312\\python.exe";
    const SCRAPER_PATH = path.join(__dirname, "..", "scraper.py");
    console.log("[scraper] Fetching data for @" + username + "...");
    const output = execSync('"' + PYTHON_PATH + '" "' + SCRAPER_PATH + '" "' + username + '"', { encoding: "utf-8", timeout: 60000 });
    const scraped = JSON.parse(output.trim());
    if (scraped.error) return res.status(502).json({ error: scraped.error });

    const blogger = data.upsertBlogger({
      username: scraped.username, full_name: scraped.full_name,
      biography: scraped.biography, profile_pic_url: scraped.profile_pic_url,
      followers_count: scraped.followers_count, following_count: scraped.following_count,
      media_count: scraped.media_count, is_verified: scraped.is_verified ? 1 : 0,
    });
    if (scraped.posts) { for (const p of scraped.posts) { data.addPost({ shortcode: p.shortcode, blogger_id: blogger.id, caption: p.caption, media_url: p.media_url, thumbnail_url: p.thumbnail_url, display_url: p.display_url, media_type: p.media_type, likes_count: p.likes_count, comments_count: p.comments_count, taken_at: p.taken_at, is_video: p.is_video ? 1 : 0 }); } }
    console.log("[scraper] Done: @" + username + " - " + (scraped.posts ? scraped.posts.length : 0) + " posts saved");
    res.json({ message: "success", blogger, posts_count: scraped.posts ? scraped.posts.length : 0 });
  } catch (err) {
    console.error("[scraper] Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
