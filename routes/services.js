const express = require('express');
const router = express.Router();
const models = require("./../models");
const wrap = require("../middleware/async-wrapper.js");

// Index
router.get("/", wrap(async (req, res) => {
    var data = {
        services: await models.Service.findAsync({}).map(a => a[res.locals.lang]),
        langer: require("../lang/services/index/" + res.locals.lang + ".json")
    }

    return res.render("services/index", data);
}));

// Show
router.get("/:url", wrap(async (req, res) => {
    var obj = await models.Service.findOneAsync({ [res.locals.lang + ".url"]: req.params.url });
    var data = {
        service: obj[res.locals.lang],
        langer: require("../lang/services/show/" + res.locals.lang + ".json")
    }

    return res.render("services/show", data);
}));

module.exports = router;
