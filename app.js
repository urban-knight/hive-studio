const dotenv = require('dotenv').config({ path: './config/.env' });
const express = require('express');
const bodyParser = require('body-parser');
const { error } = require("./middleware");
const methodOverride = require('method-override');

const { promisifyAll } = require('bluebird');

const indexRouter = require("./routes/index");

// --- Application configuration --- //
app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use('/static', express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// --- APP ROUTINGS --- //
app.use("/", indexRouter);

app.get("/*", async (req, res) => {
    return res.render("404");
});

app.use(error);

module.exports = app;