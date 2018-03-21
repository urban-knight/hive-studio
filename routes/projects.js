const express = require('express');
const router = express.Router();
const models = require("./../models");
const wrap = require("../middleware/async-wrapper.js");

// Index
router.get("/", wrap(async (req, res) => {
    var data = {
        projects: await models.Project.findAsync({}).map(a => a[res.locals.lang]),
        langer: require("../lang/projects/index/" + res.locals.lang + ".json")
    }

    return res.render("projects/index", data);
}));

// Show
router.get("/:url", wrap(async (req, res) => {
    var obj = await models.Project.findOneAsync({ [res.locals.lang + ".url"]: req.params.url });
    var data = {
        project: obj[res.locals.lang],
        langer: require("../lang/projects/show/" + res.locals.lang + ".json")
    }

    return res.render("projects/show", data);
}));

module.exports = router;
