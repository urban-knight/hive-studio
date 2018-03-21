const express = require('express');
const wrap = require("../../../middleware/async-wrapper.js");
const models = require("../../../models");
var router = express.Router();

// Index
router.get("/", wrap(async (req, res) => {
    var projects = await models.Project.findAsync({});

    return res.render("cms/projects/index", { projects: projects });
}));

// Create
router.get("/new", wrap(async (req, res) => {
    var categories = [];
    var products = await models.Product.findAsync({});
    var services = await models.Service.findAsync({});
    categories = categories.concat(products, services);
    var pictures = await models.Picture.findAsync();

    return res.render("cms/projects/new", { categories: categories, pictures: pictures });
}));
router.post("/", wrap(async (req, res) => {
    var project = req.body.project;
        project.pages = JSON.parse(req.body.pages);
        project.services = JSON.parse(req.body.services);
        project.partners = JSON.parse(req.body.partners);
        project.data = JSON.parse(req.body.data);

    var created = await models.Project.createAsync(project);
    console.log("Project added: " + created.title);

    return res.redirect("/cms/projects");
}));

// Update
router.get("/:id/edit", wrap(async (req, res) => {
    var id = req.params.id;
    var pictures = await models.Picture.findAsync();
    var project = await models.Project.findById(id);
    var categories = await models.Category.find({ url: { $in: ["sectors", "services"] } }).populate("pages");

    return res.render("cms/projects/edit", { project: project, categories: categories, pictures: pictures });
}));
router.put("/:id", wrap(async (req, res) => {
    var id = req.params.id;
    var project = req.body.project;
        project.pages = JSON.parse(req.body.pages);
        project.services = JSON.parse(req.body.services);
        project.partners = JSON.parse(req.body.partners);
        project.data = JSON.parse(req.body.data);

    var updated = await models.Project.findByIdAndUpdateAsync(id, project);
    return res.redirect("/cms/projects");
}));

// Delete
router.delete("/:id", wrap(async (req, res) => {
    var id = req.params.id;

    var projectsContainer = await models.Container.findOne({ label: "Main-Projects" });
    var project = projectsContainer.objects.find((obj) => { return obj.item == id });

    if (project) {
        const index = projectsContainer.objects.indexOf(project);
        if (index !== -1) {
            projectsContainer.objects.splice(index, 1);
        }
        await projectsContainer.save();
    }
    var deleted = await models.Project.findByIdAndRemoveAsync(id);

    return res.redirect("/cms/projects");
}));

module.exports = router;