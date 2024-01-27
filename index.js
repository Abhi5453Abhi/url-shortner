const express = require("express");
const mongoose = require("mongoose");
const UrlModel = require('./models/url');
const path = require("path");
require('dotenv').config();
const staticRoute = require("./routes/staticRouter");
const mongodbURL = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/short-url';
const urlRoute = require('./routes/url');
const app = express();
const PORT = process.env.PORT || 8001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use("/url", urlRoute);
app.use("/", staticRoute);

app.get("/test", async (req, res) => {
    const allUrls = await UrlModel.find({});
    res.render("home", { allUrls });
})

async function connectToMongoDb(url) {
    await mongoose.connect(url).then((url) => console.log("mongodb connected"));
}
app.listen(PORT, () => {
    connectToMongoDb(mongodbURL)
    console.log(`listening on PORT ${PORT}`);
})