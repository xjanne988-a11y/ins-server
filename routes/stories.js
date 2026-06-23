const express = require("express");
const data = require("../data");
const router = express.Router();

router.get("/:username", (req, res) => {
  const blogger = data.getBlogger(req.params.username);
  if (!blogger) return res.status(404).json({ error: "Blogger not found" });
  const stories = data.getStoriesByBlogger(blogger.id);
  res.json({ stories });
});

module.exports = router;
