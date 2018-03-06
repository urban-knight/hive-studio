const dotenv = require('dotenv').config({ path: './config/.env' });
const fs = require('fs');
const path = require('path');
const express = require('express');
const models = require("./models");
const db = require('./utils/db.js');
const passport = require('passport');
const langer = require("./utils/langer");
const bodyParser = require('body-parser');
const { error } = require("./middleware");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');

global.appRoot = path.resolve(__dirname);
const builder = require("./utils/builder.js");
const config = require("./config/app.json");
const { promisifyAll } = require('bluebird');

const Controller = require("./routes/controller");
const CMSController = require("./routes/cms");

// --- App Config --- //
app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
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
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(models.User.authenticate()));
passport.serializeUser(models.User.serializeUser());
passport.deserializeUser(models.User.deserializeUser());
app.use(async (req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

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

app.use(error);

module.exports = app;