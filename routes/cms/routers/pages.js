const express = require('express');
const wrap = require("../../../middleware/async-wrapper.js");
const models = require("../../../models");
var router = express.Router();

// Create
router.get("/new", wrap(async (req, res) => {
    var categories = await models.Category.findAsync();
    var pictures = await models.Picture.findAsync();

    return res.render("cms/pages/new", {pictures: pictures, categories: categories});
}));
router.post("/", wrap(async (req, res) => {
    var page = req.body.page;
    var created = await models.Page.create(page);
    var category = await models.Category.findByIdAsync(page.category);
        category.pages.push(created.id);
        await category.save();

    return res.redirect("/cms/catalogue");
}));

// Update
router.get("/:id/edit", wrap(async (req, res) => {
    var id = req.params.id;
    var pictures = await models.Picture.findAsync();
    var page = await models.Page.findById(id);
    var categories = await models.Category.findAsync();

    return res.render("cms/pages/edit", { page: page, categories: categories, pictures: pictures });
}));
router.put("/:id", wrap(async (req, res) => {
    var id = req.params.id;
    var page = req.body.page;
    var found = await models.Page.findByIdAsync(id);
    var updated = await models.Page.findByIdAndUpdateAsync(id, page);
    
    if (found.category != updated.category){
        var oldCat = await models.Category.findByIdAsync(found.category);
        var newCat = await models.Category.findByIdAsync(page.category);
        oldCat.pages.splice(oldCat.pages.indexOf(id), 1);
        await oldCat.save();
        newCat.pages.push(id);
        await newCat.save();
    }

    return res.redirect("/cms/catalogue");
}));

// Deactivate
router.put("/:id/deactivate", wrap(async (req, res) => {
    var id = req.params.id;
    
    var updated = await models.Page.findByIdAndUpdateAsync(id, {isActive: false});
    var category_updated = await models.Category.findByIdAndUpdateAsync(updated.category, {$pull: {pages: id }});
    
    return res.redirect("/cms/catalogue");
}));

// Delete
router.delete("/:id", wrap(async (req, res) => {
    var id = req.params.id;
    var pagesContainer = await models.Container.findOne({ label: "Main-Pages" });
    var contained = pagesContainer.objects.find((obj) => { return obj.item == id });

    if (contained) {
        const index = pagesContainer.objects.indexOf(contained);
        if (index !== -1) {
            pagesContainer.objects.splice(index, 1);
        }
        await pagesContainer.save();
    }

    var page = await models.Page.findByIdAsync(id);
    var category = await models.Category.findByIdAsync(page.category);
    if (category) {
        const index = category.pages.indexOf(id);
        if (index !== -1) {
            category.pages.splice(index, 1);
        }
        await category.save();
    }

    var projects = await models.Project.findAsync({ pages: { "$in": [id] } });
    if (projects.length > 0) {
        for (let project of projects) {
            const index = project.pages.indexOf(id);
            if (index !== -1) {
                project.pages.splice(index, 1);
            }
            await project.save();
        }
    }
    var deleted = await models.Page.findByIdAndRemoveAsync(id);
    return res.redirect("/cms/catalogue");
}));

module.exports = router;