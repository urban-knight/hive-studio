const path = require('path');
const urljoin = require('url-join');
const conf = require('../config/app.json');
const express = require('express');
const wrap = require("../middleware/async-wrapper.js");

var joinURL = async (options) => {
    var url = "/";
    if (options.prefix && !options.postfix) {
        url = urljoin("/:" + options.prefix, options.main);
    } else if (!options.prefix && options.postfix) {
        url = urljoin("/", options.main, "/:" + options.postfix);
    } else if (options.prefix && options.postfix) {
        url = urljoin("/:" + options.prefix, options.main, "/:" + options.postfix);
    } else {
        if (options.main == "") {
            url = "/";
        } else {
            url = urljoin("/", options.main);
        }
    }
    return url;
}

var collectURLs = async (options) => {
    var urls = [];
    for (obj of options.array) {
        for (lang of conf.langs) {
            let main = obj[lang].url;
            let prefix = options.prefix;
            let postfix = options.postfix;
            let _url = await joinURL({ prefix, main, postfix });
            if (urls.indexOf(_url) === -1) {
                urls.push(_url);
            }
        }
    }
    return urls;
}

var collectLangSubdirs = async (defaultLang, langs) => {
    var subdirs = [];
    for (lang of langs) {
        if (lang !== defaultLang) {
            subdirs.push(await joinURL({ main: lang }));
        }
    }
    return subdirs;
}

var baseRouter = async (config, models) => {
    var router = express.Router();
    var pages = await models.Page.findAsync({});
    var datasets = await models.Dataset.findAsync({});
    var pageURLs = await collectURLs({ array: pages });
    var indexURLs = await collectURLs({ array: datasets });
    var indexSubURLs = await collectURLs({ array: datasets, postfix: "url" });

    router.use("/blog", require("../routes/blog"));

    router.get(pageURLs, wrap(async (req, res) => {
        var url = req.path.split("/")[1];
        var page = await models.Page.findOneAsync({ [`${res.locals.lang}.url`]: url });
        if (page) {
            var data = {
                langer: require("../lang/" + page.view + "/" + res.locals.lang + ".json")
            };
            if (page.objects) {
                for (object of page.objects) {
                    data[object.name] = await models[object.model].findAsync({}).map(a => a[res.locals.lang]);
                }
            }
            return res.render(page.view, data);
        } else {
            return res.status(404).render("404");
        }
    }));
    router.get(indexURLs, wrap(async (req, res) => {
        var url = req.path.split("/")[1];
        var index = await models.Dataset.findOneAsync({ [`${res.locals.lang}.url`]: url });

        if (index) {
            var data = {
                pages: pages,
                langer: require("../lang/" + index.view + "/index/" + res.locals.lang + ".json")
            };
            data[index.objects] = await models[index.model].findAsync({}).map(a => a[res.locals.lang]);

            return res.render(path.join(index.view, "index"), data);
        } else {
            return res.status(404).render("404");
        }
    }));
    router.get(indexSubURLs, wrap(async (req, res) => {
        var indexURL = req.path.split("/")[1];
        var index = await models.Dataset.findOneAsync({ [`${res.locals.lang}.url`]: indexURL });
        if (index) {
            var obj = await models[index.model].findOneAsync({ [`${res.locals.lang}.url`]: req.params.url });
            if (obj) {
                var data = {
                    index: index,
                    [index.model.toLowerCase()]: obj,
                    langer: require("../lang/" + index.view + "/show/" + res.locals.lang + ".json")
                }
                return res.render(path.join(index.view, "show"), data);
            } else {
                return res.status(404).render("404");
            }
        } else {
            return res.status(404).render("404");
        }
    }));

    return router;
}

module.exports = {
    baseRouter: baseRouter,
    collectLangSubdirs: collectLangSubdirs
}