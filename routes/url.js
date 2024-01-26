const express = require("express");
const { generateNewShortUrl, getShortenedUrl, getShortenedUrlAnalytics } = require("../controllers/url");

const router = express.Router();

router.post('/', generateNewShortUrl);

router.get('/:shortId', getShortenedUrl);

router.get('/analytics/:shortId', getShortenedUrlAnalytics);

module.exports = router;