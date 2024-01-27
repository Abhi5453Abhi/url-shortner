const express = require("express");
const { nanoid } = require('nanoid');
const UrlModel = require('../models/url');
const path = require("path");
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

async function generateNewShortUrl(req, res) {
    if (!req.body || !req.body.url) return res.status(400).json({ error: 'Url is required' });
    const { url } = req.body;
    let shortId;
    const urlExists = await UrlModel.findOne({ redirectUrl: url }, { shortId: 1 }).lean().exec();
    if (urlExists) {
        shortId = urlExists.shortId;
    } else {
        shortId = nanoid(8);
        await UrlModel.create({
            shortId,
            redirectUrl: url,
            visitHistory: []
        });
    }
    const allUrls = await UrlModel.find({});
    return res.render('home', { shortId, allUrls });
}

async function getShortenedUrl(req, res) {
    if (!req.params || !req.params.shortId) return res.status(400).json({ error: 'Please provide short url Id in params' });
    const { shortId } = req.params;
    console.log({ shortId });
    // if (!url) return res.status(400).json({ error: 'Url is required' });
    const entry = await UrlModel.findOneAndUpdate(
        { shortId },
        {
            $push: {
                visitHistory: { timestamp: Date.now() }
            }
        },
        { new: true }
    );
    console.log({ entry });
    if (!entry) return res.status(400).json({ error: 'Short url id not found' });
    return res.redirect(entry.redirectUrl);
}

async function getShortenedUrlAnalytics(req, res) {
    if (!req.params || !req.params.shortId) return res.status(400).json({ error: 'Please provide short url Id in params' });
    const { shortId } = req.params;
    // if (!url) return res.status(400).json({ error: 'Url is required' });
    const entry = await UrlModel.findOne(
        { shortId },
        { visitHistory: 1 }
    );
    if (!entry) return res.status(400).json({ error: 'Short url id not found' });
    return res.json({ clicks: entry.visitHistory.length, Analytics: entry.visitHistory });
}

async function getAllUrls(req, res) {
    const allUrls = await UrlModel.find({});
    console.log({ allUrls });
    return res.render('home', { allUrls });
}

module.exports = {
    generateNewShortUrl,
    getShortenedUrl,
    getShortenedUrlAnalytics,
    getAllUrls,
}