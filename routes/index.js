module.exports = {
    apply: async (app) => {
        const path = require('path');
        const express = require('express');

        const models = require("../models");
        const config = require("../config/app.json");
        const builder = require("../utils/builder.js");
        const wrap = require("../middleware/async-wrapper.js");

        var router = express.Router();

        var pages = await models.Page.findAsync({});
        var pageURLs = builder.collectURLs(pages);

        var datasets = await models.Dataset.findAsync({});
        var indexURLs = builder.collectURLs(datasets);

        router.get(pageURLs, wrap(async (req, res) => {
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
                return res.status(404).render("404");
            }

        }));

        router.get(indexURLs, wrap(async (req, res) => {
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
                return res.status(404).render("404");
            }
        }));

        var indexParamURLs = builder.collectURLsWithParameter(datasets, "url");

        router.get(indexParamURLs, wrap(async (req, res) => {
            var indexURL = req.originalUrl.split("/")[1];
            var index = await models.Dataset.findOneAsync({ [`${res.locals.lang}.url`]: indexURL });
            var obj = await models[index.model].findOneAsync({ [`${res.locals.lang}.url`]: req.params.url });

            var data = {
                index: index,
                [index.model.toLowerCase()]:obj,
                langer: require("../lang/" + index.view + "/show/" + res.locals.lang + ".json")
            }

            return res.render(path.join(index.view, "show"), data);
        }));

        router.use("/blog", require("../routes/blog"));
        router.use("/pictures", require("../routes/pictures"));

        app.use("/", router);
        app.use("/cms", require("../routes/cms"));

        app.get("/*", async (req, res) => {
            return res.status(404).render("404");
        });
    }
};