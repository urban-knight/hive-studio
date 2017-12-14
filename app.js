const dotenv = require('dotenv').config({ path: './config/.env' });
const path = require("path");
const express = require('express');
const i18n = require("i18n-express");
const bodyParser = require('body-parser');
const { error } = require("./middleware");
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

const { promisifyAll } = require('bluebird');

const indexRouter = require("./routes/index");

// --- Application configuration --- //
app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use('/static', express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// --- i18n Config --- //
app.use(i18n({
    translationsPath: path.join(__dirname, 'lang'),
    siteLangs: ["en", "ru", "ua"],
    textsVarName: 'translation'
}));

// --- APP ROUTINGS --- //
app.use("/", indexRouter);

app.get("/*", async (req, res) => {
    return res.render("404");
});

app.use(error);

module.exports = app;