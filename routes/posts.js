const express = require("express");
const data = require("../data");
const router = express.Router();

router.get("/:shortcode", (req, res) => {
  const post = data.getPost(req.params.shortcode);
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json({ post });
});

module.exports = router;
