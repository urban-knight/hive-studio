const express = require('express');
const wrap = require("../../../../middleware/async-wrapper.js");
const models = require("../../../../models");
var router = express.Router();

// Create
router.get("/new", wrap(async (req, res) => {
    var services = await models.Service.findAsync();
    return res.render("cms/blog/categories/new", {services: services});
}));
router.post("/", wrap(async (req, res) => {
    var category = req.body.category;
    var created = await models.Category.create(category);

    return res.redirect("/cms/blog");
}));

// Show 
router.get("/:id", wrap(async (req, res) => {
    var id = req.params.id;
    var category = await models.Category.findById(id).populate("service").populate("posts");

    return res.render("cms/blog/categories/show", {category: category});
}));

// Update
router.get("/:id/edit", wrap(async (req, res) => {
    var id = req.params.id;
    var category = await models.Category.findByIdAsync(id);
    var services = await models.Service.findAsync();

    return res.render("cms/blog/categories/edit", { category: category, services: services });
}));
router.put("/:id", wrap(async (req, res) => {
    var id = req.params.id;
    var category = req.body.category;
    var updated = await models.Category.findByIdAndUpdateAsync(id, category);

    return res.redirect("/cms/blog");
}));

// Delete
router.delete("/:id", wrap(async (req, res) => {
    var id = req.params.id;
    var deleted = await models.Category.findByIdAndRemoveAsync(id);

    return res.redirect("/cms/blog");
}));

module.exports = router;