const express = require('express');
const wrap = require("../../../middleware/async-wrapper.js");
const models = require("../../../models");
var router = express.Router();

// Index
router.get("/", wrap(async (req, res) => {
    var cases = await models.Case.find({});
    var projects = await models.Project.find({}).populate("category.item");

    return res.render("cms/projects/index", { cases: cases, projects: projects });
}));

// Create
router.get("/new", wrap(async (req, res) => {
    var categories = [];
    var products = await models.Product.findAsync({});
    var services = await models.Service.findAsync({});

    for (product of products) {
        var category = {
            name: product.en.name,
            object: {
                kind: "Product",
                item: product.id
            }
        }
        categories.push(category);
    }

    for (service of services) {
        var category = {
            name: service.en.name,
            object: {
                kind: "Service",
                item: service.id
            }
        }
        categories.push(category);
    }

    var pictures = await models.Picture.findAsync({});
    var cases = await models.Case.findAsync({});

    return res.render("cms/projects/new", { categories: categories, pictures: pictures, cases: cases });
}));
router.post("/", wrap(async (req, res) => {
    var project = req.body.project;

        if (typeof project.category == "string") {
            project.category = JSON.parse(project.category);
        }

        for (lang of global.langs) {
            if (typeof project[lang].scope == "string") {
                project[lang].scope = JSON.parse(project[lang].scope);
            }
        }

    var created = await models.Project.createAsync(project);
    console.log("Project added: " + created.en.name);

    return res.redirect("/cms/projects");
}));

// Update
router.get("/:id/edit", wrap(async (req, res) => {
    var id = req.params.id;
    
    var categories = [];
    var products = await models.Product.findAsync({});
    var services = await models.Service.findAsync({});

    for (product of products) {
        var category = {
            name: product.en.name,
            object: {
                kind: "Product",
                item: product.id
            }
        }
        categories.push(category);
    }

    for (service of services) {
        var category = {
            name: service.en.name,
            object: {
                kind: "Service",
                item: service.id
            }
        }
        categories.push(category);
    }

    var pictures = await models.Picture.findAsync({});
    var cases = await models.Case.findAsync({});
    var project = await models.Project.findById(id).populate("business_case");

    return res.render("cms/projects/edit", { project: project, categories: categories, pictures: pictures, cases: cases });
}));
router.put("/:id", wrap(async (req, res) => {
    var id = req.params.id;
    var project = req.body.project;

    if (typeof project.category == "string") {
        project.category = JSON.parse(project.category);
    }

    for (lang of global.langs) {
        if (typeof project[lang].scope == "string") {
            project[lang].scope = JSON.parse(project[lang].scope);
        }
    }

    var updated = await models.Project.findByIdAndUpdateAsync(id, project);
    return res.redirect("/cms/projects");
}));

// Delete
router.delete("/:id", wrap(async (req, res) => {
    var id = req.params.id;
    var deleted = await models.Project.findByIdAndRemoveAsync(id);

    return res.redirect("/cms/projects");
}));

module.exports = router;