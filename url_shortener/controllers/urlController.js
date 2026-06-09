const shortid = require("shortid");
const URL = require("../models/urls");

async function handlegenerateNewShortURL(req, res) {
  const body = req.body.url;
  if (!body) return res.status(400).json({ error: "url is required" });

  const urlExist = await URL.findOne({
    createdBy: req.user._id,
    redirectUrl: body,
  });
  if (urlExist) {
    return res.render("home", { id: urlExist.shortId });
  }
  const shortID = shortid();
  await URL.create({
    shortId: shortID,
    redirectUrl: body,
    visitHistory: [],
    createdBy: req.user._id,
  });
  return res.render("home", { id: shortID });
}
async function handleAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  handlegenerateNewShortURL,
  handleAnalytics,
};
