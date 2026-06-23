const express = require("express");
const data = require("../data");
const router = express.Router();

router.get("/:shortcode", (req, res) => {
  const comments = data.getComments(req.params.shortcode);
  res.json({ comments });
});

router.get("/translate/text", async (req, res) => {
  const { text, to } = req.query;
  if (!text) return res.status(400).json({ error: "text is required" });
  try {
    const lang = to || "zh-CN";
    const response = await fetch("https://api.mymemory.translated.net/get?q=" + encodeURIComponent(text) + "&langpair=en|" + encodeURIComponent(lang), { timeout: 5000 });
    const data = await response.json();
    if (data.responseStatus === 200) { res.json({ translated: data.responseData.translatedText }); }
    else { res.json({ translated: text }); }
  } catch (err) { res.json({ translated: text }); }
});

module.exports = router;
