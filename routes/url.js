const express = require("express");
const { generateNewShortUrl, getShortenedUrl, getShortenedUrlAnalytics } = require("../controllers/url");

const router = express.Router();

router.post('/', async (req, res) => {
    const customUrl = "http://google.com"; // Set your custom URL here or leave it as null
    await generateNewShortUrl(req, res, null);
});

router.get('/:shortId', getShortenedUrl);

router.get('/analytics/:shortId', getShortenedUrlAnalytics);

module.exports = router;