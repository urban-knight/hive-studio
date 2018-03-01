const { promisifyAll } = require('bluebird');
const express = require('express');
const path = require('path');

const middleware = require("../middleware");
const wrap = require("../middleware/async-wrapper.js");

var router = express.Router();

var pages = ["/", "/about", "/contacts", "/order", "/support"];

router.get(pages, wrap(async (req, res) => {

    var url = req.originalUrl;
    var pageName = "index";
    if (url !== "/"){
        pageName = url.substr(1);
    }

    return res.render(pageName);
}));

var indexes = ["/services", "/products", "/projects"];

router.get(indexes, wrap(async (req, res) => {
    var url = req.originalUrl;
    var indexName = path.join(url.substr(1), "index");
    
    return res.render(indexName);
}));

module.exports = router;