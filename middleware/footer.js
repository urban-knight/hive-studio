module.exports = {
    apply: async (app) => {
        const models = require("../models");
        const builder = require("../utils/builder.js");

        var pages = await models.Page.findAsync({});
        var indexModels = await models.Dataset.findAsync({});
        var indexes = [];

        for (const _model of indexModels) {
            var i = _model.toObject({virtuals: true});
            var objects = await models[_model.model].findAsync({});
            i.objects = objects;
            indexes.push(i);
        }

        var categories = await models.Category.findAsync({});

        app.use(async (req, res, next) => {
            res.locals.footer = {
                pages: pages,
                indexes: indexes,
                categories: categories
            }
            next();
        })
    }
};