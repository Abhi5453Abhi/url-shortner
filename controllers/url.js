const express = require("express");
const { nanoid } = require('nanoid');
const UrlModel = require('../models/url');
const path = require("path");
const app = express();
const qr = require('qrcode');
const fs = require('fs');
const _ = require('lodash')

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

async function generateNewShortUrl(req = null, res = null, customUrl = null) {
    try {
        if (customUrl == null) {
            if (!req.body || !req.body.url) return res.status(400).json({ error: 'Url is required' });
        }
        const url = customUrl || req.body.url;
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
        const shortUrl = `https://snipzip.onrender.com/url/${shortId}`;
        const qrCodeData = await generateQRCode(shortUrl);

        const allUrls = await UrlModel.find({});
        console.log({ customUrl });
        if (customUrl != null) {
            console.log("Cron job successfully executed");
        } else {
            return res.render('home', { shortId, allUrls, qrCodeData });
        }
    } catch (err) {
        console.log({ err });
    }

}

async function generateQRCode(data) {
    try {
        const qrCodeBuffer = await qr.toBuffer(data);
        return qrCodeBuffer.toString('base64'); // Convert to base64 for embedding in HTML
    } catch (error) {
        console.error('Error generating QR code:', error);
        return null;
    }
}

async function getShortenedUrl(req, res) {
    if (!req.params || !req.params.shortId) return res.status(400).json({ error: 'Please provide short url Id in params' });
    const { shortId } = req.params;
    const entry = await UrlModel.findOneAndUpdate(
        { shortId },
        {
            $push: {
                visitHistory: { timestamp: Date.now() }
            }
        },
        { new: true }
    );
    if (!entry) return res.status(400).json({ error: 'Short url id not found' });
    return res.redirect(entry.redirectUrl);
}

async function getShortenedUrlAnalytics(req, res) {
    if (!req.params || !req.params.shortId) return res.status(400).json({ error: 'Please provide short url Id in params' });
    const { shortId } = req.params;
    const entry = await UrlModel.findOne(
        { shortId },
        { visitHistory: 1 }
    );
    if (!entry) return res.status(400).json({ error: 'Short url id not found' });
    return res.json({ clicks: entry.visitHistory.length, Analytics: entry.visitHistory });
}

async function getAllUrls(req, res) {
    const allUrls = await UrlModel.find({});
    return res.render('home', { allUrls });
}

module.exports = {
    generateNewShortUrl,
    getShortenedUrl,
    getShortenedUrlAnalytics,
    getAllUrls,
}