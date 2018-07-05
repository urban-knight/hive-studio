module.exports = {
    apply: async (app) => {
        const path = require('path');
        const express = require('express');
        const models = require("../models");
        const config = require("../config/app.json");
        const builder = require("../utils/builder.js");
        const wrap = require("../middleware/async-wrapper.js");
        var router = express.Router();

        // -- Init setup --//
        // Load init data from db 
        var pages = await models.Page.findAsync({});
        var datasets = await models.Dataset.findAsync({});
        // Build static urls to mount
        var defaultPageURLs = await builder.collectURLs({ array: pages });
        var defaultIndexURLs = await builder.collectURLs({ array: datasets });

        var langPageURLs = await builder.collectURLs({ prefix: "lang", array: pages });
        var langIndexURLs = await builder.collectURLs({ prefix: "lang", array: datasets });

        var defaultIndexSubURLs = await builder.collectURLs({ array: datasets, postfix: "url" });
        var langIndexSubURLs = await builder.collectURLs({prefix: "lang", array: datasets, postfix: "url" });

        // Mount subrouters
        router.use("/blog", require("../routes/blog"));
        router.use("/pictures", require("../routes/pictures"));

        // Default lang routers
        router.get(defaultPageURLs, wrap(async (req, res) => {
            var lang = config.defaultLang;
            res.locals.lang = lang;
            var url = req.originalUrl.split("/")[1];
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
                var path404 = path.join(appRoot, config.langPath, "404", lang + ".json");
                res.locals.page404 = require(path404);
                return res.status(404).render("404");
            }
        }));
        router.get(defaultIndexURLs, wrap(async (req, res) => {
            var lang = config.defaultLang;
            res.locals.lang = lang;
            var url = req.originalUrl.split("/")[1];
            var index = await models.Dataset.findOneAsync({ [`${res.locals.lang}.url`]: url });

            if (index) {
                var data = {
                    pages: pages,
                    langer: require("../lang/" + index.view + "/index/" + res.locals.lang + ".json")
                };
                data[index.objects] = await models[index.model].findAsync({}).map(a => a[res.locals.lang]);

                return res.render(path.join(index.view, "index"), data);
            } else {
                var path404 = path.join(appRoot, config.langPath, "404", lang + ".json");
                res.locals.page404 = require(path404);
                return res.status(404).render("404");
            }
        }));
        router.get(defaultIndexSubURLs, wrap(async (req, res) => {
            var lang = config.defaultLang;
            res.locals.lang = lang;
            var indexURL = req.originalUrl.split("/")[1];
            var index = await models.Dataset.findOneAsync({ [`${res.locals.lang}.url`]: indexURL });
            var obj = await models[index.model].findOneAsync({ [`${res.locals.lang}.url`]: req.params.url });

            var data = {
                index: index,
                [index.model.toLowerCase()]: obj,
                langer: require("../lang/" + index.view + "/show/" + res.locals.lang + ".json")
            }
            return res.render(path.join(index.view, "show"), data);
        }));

        // Subdir lang routers
        router.get(langPageURLs, wrap(async (req, res) => {
            var lang = req.originalUrl.split("/")[1];
            if (config.langs.indexOf(lang) !== -1) {
                res.locals.lang = lang;
                var url = req.originalUrl.split("/")[2]||"";
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
                    var path404 = path.join(appRoot, config.langPath, "404", lang + ".json");
                    res.locals.page404 = require(path404);
                    return res.status(404).render("404");
                }
            } else {
                var path404 = path.join(appRoot, config.langPath, "404", lang + ".json");
                res.locals.page404 = require(path404);
                return res.status(404).render("404");
            }
        }));
        router.get(langIndexURLs, wrap(async (req, res) => {
            var lang = req.originalUrl.split("/")[1];
            if (config.langs.indexOf(lang) !== -1) {
                res.locals.lang = lang;
                var url = req.originalUrl.split("/")[2];
                var index = await models.Dataset.findOneAsync({ [`${res.locals.lang}.url`]: url });

                if (index) {
                    var data = {
                        pages: pages,
                        langer: require("../lang/" + index.view + "/index/" + res.locals.lang + ".json")
                    };
                    data[index.objects] = await models[index.model].findAsync({}).map(a => a[res.locals.lang]);

                    return res.render(path.join(index.view, "index"), data);
                } else {
                    var path404 = path.join(appRoot, config.langPath, "404", lang + ".json");
                    res.locals.page404 = require(path404);
                    return res.status(404).render("404");
                }
            } else {
                var path404 = path.join(appRoot, config.langPath, "404", lang + ".json");
                res.locals.page404 = require(path404);
                return res.status(404).render("404");
            }
        }));
        router.get(langIndexSubURLs, wrap(async (req, res) => {
            var lang = req.originalUrl.split("/")[1];
            if (config.langs.indexOf(lang) !== -1) {
                res.locals.lang = lang;
                var url = req.originalUrl.split("/")[3];
                var indexURL = req.originalUrl.split("/")[2];
                var index = await models.Dataset.findOneAsync({ [`${res.locals.lang}.url`]: indexURL });
                var obj = await models[index.model].findOneAsync({ [`${res.locals.lang}.url`]: req.params.url });

                var data = {
                    index: index,
                    [index.model.toLowerCase()]: obj,
                    langer: require("../lang/" + index.view + "/show/" + res.locals.lang + ".json")
                }
                return res.render(path.join(index.view, "show"), data);
            } else {
                var path404 = path.join(appRoot, config.langPath, "404", lang + ".json");
                res.locals.page404 = require(path404);
                return res.status(404).render("404");
            }
        }));

        app.use("/cms", require("../routes/cms"));
        app.use("/", router);


        // Add 404 for anything else
        app.get("/*", async (req, res) => {
            var path404 = path.join(appRoot, config.langPath, "404", "en" + ".json");
            res.locals.page404 = require(path404);
            return res.status(404).render("404");
        });
    }
};