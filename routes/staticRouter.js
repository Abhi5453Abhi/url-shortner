const express = require("express");
const router = express.Router();
const { getAllUrls } = require("../controllers/url");

router.get('/', getAllUrls);

module.exports = router;