const dotenv = require('dotenv').config({ path: './config/.env' });

const path = require('path');

const express = require('express');

const db = require('./utils/db.js');

const langer = require("./utils/langer");

let http_port = process.env.APP_HTTP_PORT || 80;
let host = process.env.APP_HOST || "localhost";


global.appRoot = path.resolve(__dirname);
const builder = require("./utils/builder.js");
const config = require("./config/app.json");
const { promisifyAll } = require('bluebird');

const { apply: applyRoutes } = require('./routes');
const { apply: applyMiddlewares } = require('./middleware');

const Controller = require("./routes/controller");
const CMSController = require("./routes/cms");

// --- App Config --- //
app = express();


var pages = builder.extractPages(config.pages);
var indexes = builder.extractIndexes(config.indexes, config.indexTarget);

// --- Langer Config --- //
app.use(langer({
    translationsPath: path.join(__dirname, config.langPath),
    siteLangs: config.langs,
    textsVarName: config.langVar,
    cookieLangName: config.langCookie,
    pageURLs: pages.map(a => a.url),
    indexURLs: indexes.map(a => a.url),
}));

// --- Controllers --- //
app.use("/", Controller);
app.use("/cms", CMSController);

app.get("/*", async (req, res) => {
    return res.status(404).render("404");
});

applyMiddlewares(app);

applyRoutes(app).then(() => {
    app.listen(http_port, () => {
        console.log("Application is listening on: http://" + host + ":" + http_port);
    });
});

module.exports = app;