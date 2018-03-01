const dotenv = require('dotenv').config({ path: './config/.env' });
const fs = require('fs');
const path = require("path");
const express = require('express');
const langer = require("./utils/langer");
const bodyParser = require('body-parser');
const { error } = require("./middleware");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

const { promisifyAll } = require('bluebird');

const Controller = require("./routes/controller");

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

var pageURLs = ["/", "/about", "/contacts", "/order", "/support"];
var indexURLs = ["/services", "/products", "/projects"];

// --- Langer Config --- //
app.use(langer({
    translationsPath: path.join(__dirname, 'lang'),
    siteLangs: ["en", "ru", "ua"],
    textsVarName: 'translation',
    cookieLangName: 'lang',
    pageURLs: pageURLs,
    indexURLs: indexURLs
}));

// --- APP ROUTINGS --- //
app.use("/", Controller);

app.get("/*", async (req, res) => {
    return res.status(404).render("404");
});

app.use(error);

module.exports = app;