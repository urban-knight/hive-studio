const express = require('express');
const wrap = require("../../../../middleware/async-wrapper.js");
const models = require("../../../../models");
var router = express.Router();

// Index
router.get("/", wrap(async (req, res) => {
    var tags = await models.Tag.findAsync({});

    return res.render("cms/blog/tags/index", {tags: tags});
}));
router.get("/list", wrap(async (req, res) => {
    var tags = await models.Tag.findAsync({});

    return res.json(tags);
}));
router.get("/search", wrap(async (req, res) => {

    if (req.query.name) {
        var tags = await models.Tag.findAsync({ "en.name": { $regex: "^" + req.query.name, $options: 'i' } });
    }

    if (req.query.id) {
        var tag = await models.Tag.findByIdAsync(req.query.id);

        return res.json(tag);
    }
        

    return res.json(tags);
}));

// Create
router.get("/new", wrap(async (req, res) => {
    return res.render("cms/blog/tags/new");
}));
router.post("/", wrap(async (req, res) => {
    var tag = req.body.tag;
    var created = await models.Tag.create(tag);

    return res.redirect("/cms/blog/tags");
}));

// Update
router.get("/:id/edit", wrap(async (req, res) => {
    var id = req.params.id;
    var tag = await models.Tag.findByIdAsync(id);

    return res.render("cms/blog/tags/edit", { tag: tag });
}));
router.put("/:id", wrap(async (req, res) => {
    var id = req.params.id;
    var tag = req.body.tag;
    var updated = await models.Tag.findByIdAndUpdateAsync(id, tag);

    return res.redirect("/cms/blog/tags");
}));

// Delete
router.delete("/:id", wrap(async (req, res) => {
    var id = req.params.id;
    var deleted = await models.Tag.findByIdAndRemoveAsync(id);

    return res.redirect("/cms/blog/tags");
}));

module.exports = router;