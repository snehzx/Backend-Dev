const express = require("express");
const {
  handlegenerateNewShortURL,
  handleAnalytics,
} = require("../controllers/urlController");
const router = express.Router();
router.post("/", handlegenerateNewShortURL);
router.get("/analytics/:shortId", handleAnalytics);
module.exports = router;
