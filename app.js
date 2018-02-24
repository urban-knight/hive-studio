const dotenv = require('dotenv').config({ path: './config/.env' });
const fs = require('fs');
const path = require("path");
const express = require('express');
const i18n = require("i18n-express");
const bodyParser = require('body-parser');
const { error } = require("./middleware");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

const { promisifyAll } = require('bluebird');

const indexRouter = require("./routes/index");

// --- Application configuration --- //
app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use('/static', express.static(__dirname + "/public"));
app.use('/', express.static(__dirname + "/files"));
app.use(methodOverride("_method"));
app.use(cookieParser("hive-studio"));

app.use(session({
    secret: "hive-studio",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

// --- i18n Config --- //
app.use(i18n({
    translationsPath: path.join(__dirname, 'lang'),
    siteLangs: ["en", "ru", "ua"],
    textsVarName: 'translation',
    cookieLangName: 'lang'
}));

// --- APP ROUTINGS --- //

app.use("/", indexRouter);

app.get("/*", async (req, res) => {
    return res.status(404).render("404");
});

app.use(error);

module.exports = app;