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

router.get(pages.map(a => a.url), wrap(async (req, res) => {
    var page = pages.find((e)=>{return e.url == req.originalUrl});
    var data = {pages: pages};

    if (page.models) {
        for (const [i, model] of page.models.entries()) {
            data[page.data[i]] = await models[model].findAsync({}).map(a => a[res.locals.lang]);
        }
    }

    return res.render(page.name, data);
}));

var indexes = builder.extractIndexes(config.indexes, config.indexTarget);

router.get(indexes.map(a => a.url), wrap(async (req, res) => {
    var index = indexes.find((e)=>{return e.url == req.originalUrl});
    var objects = await models[index.model].findAsync({}).map(a => a[res.locals.lang]);
    
    return res.render(path.join(index.name, "index"), {[index.name]: objects});
}));

router.get(indexes.map(a => a.target), wrap(async (req, res) => {
    var index = indexes.find((e)=>{return e.url == "/" + req.originalUrl.split("/")[1]});
    var obj = await models[index.model].findOneAsync({[res.locals.lang + ".url"]: req.params.url});
    
    return res.render(path.join(index.name, "show"), {[index.name.slice(0, -1)]: obj[res.locals.lang]});
}));

module.exports = router;