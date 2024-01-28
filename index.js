const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require('dotenv').config();
const staticRoute = require("./routes/staticRouter");
const mongodbURL = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/short-url';
const urlRoute = require('./routes/url');
const app = express();
const PORT = process.env.PORT || 8001;
const { generateNewShortUrl } = require('./controllers/url'); // Import your controller logic
const cron = require('node-cron');

console.log({ mongodbURL });
console.log({ PORT });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use("/url", urlRoute);
app.use("/", staticRoute);

// Set up a cron job to run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
    console.log('Running generateNewShortUrl cron job...');
    await generateNewShortUrl(null, null, "http://google.com");
});

async function connectToMongoDb(url) {
    await mongoose.connect(url).then((url) => console.log("mongodb connected"));
}
app.listen(PORT, () => {
    connectToMongoDb(mongodbURL)
    console.log(`listening on PORT ${PORT}`);
})