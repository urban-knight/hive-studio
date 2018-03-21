const path = require('path');
const express = require('express');
const { promisifyAll } = require('bluebird');

const models = require("../models");
const config = require("../config/app.json");
const builder = require("../utils/builder.js");

const middleware = require("../middleware");
const wrap = require("../middleware/async-wrapper.js");

var router = express.Router();

var pages = builder.extractPages(config.pages);

router.get("/", wrap(async (req, res) => {
    var data = {
        services: await models.Service.findAsync({}).map(a => a[res.locals.lang]),
        products: await models.Product.findAsync({}).map(a => a[res.locals.lang]),
        projects: await models.Product.findAsync({}).map(a => a[res.locals.lang]),
        langer: require("../lang/" + res.locals.lang + ".json")
    }
    return res.render("index", data);
}));

router.get("/about", wrap(async (req, res) => {
    var data = {
        langer: require("../lang/about/" + res.locals.lang + ".json")
    }
    return res.render("about", data);
}));

router.get("/order", wrap(async (req, res) => {
    var data = {
        langer: require("../lang/order/" + res.locals.lang + ".json")
    }
    return res.render("order", data);    
}));

router.get("/contacts", wrap(async (req, res) => {
    var data = {
        langer: require("../lang/contacts/" + res.locals.lang + ".json")
    }
    return res.render("contacts", data);
}));

router.get("/support", wrap(async (req, res) => {
    var data = {
        langer: require("../lang/support/" + res.locals.lang + ".json")
    }
    return res.render("support", data);
}));

router.use("/blog", require("./blog"));
router.use("/services", require("./services"));
router.use("/products", require("./products"));
router.use("/projects", require("./projects"));
router.use("/pictures", require("./pictures"));

module.exports = router;