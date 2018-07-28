const express = require('express');
const wrap = require("../../../middleware/async-wrapper.js");
const models = require("../../../models");
var router = express.Router();

// Index
router.get("/", wrap(async (req, res)=>{
    var pages = await models.Page.findAsync({});

    return res.render("cms/pages/index", {pages: pages});
}));

// Create
router.get("/new", wrap(async (req, res) => {
    return res.render("cms/pages/new");
}));
router.post("/", wrap(async (req, res) => {
    var page = req.body.page;

    for (lang of global.langs) {
        if (typeof page[lang].keywords == "string") {
            page[lang].keywords = JSON.parse(page[lang].keywords);
        }
    }

    var created = await models.Page.create(page);

    return res.redirect("/cms/pages");
}));

// Update
router.get("/:id/edit", wrap(async (req, res) => {
    var id = req.params.id;
    var page = await models.Page.findByIdAsync(id);

    return res.render("cms/pages/edit", { page: page});
}));
router.put("/:id", wrap(async (req, res) => {
    var id = req.params.id;
    var page = req.body.page;

    for (lang of global.langs) {
        if (typeof page[lang].keywords == "string") {
            page[lang].keywords = JSON.parse(page[lang].keywords);
        }
    }

    var updated = await models.Page.findByIdAndUpdateAsync(id, page);

    return res.redirect("/cms/pages");
}));

// Delete
router.delete("/:id", wrap(async (req, res) => {
    var id = req.params.id;
    var deleted = await models.Page.findByIdAndRemoveAsync(id);

    return res.redirect("/cms/pages");
}));

module.exports = router;