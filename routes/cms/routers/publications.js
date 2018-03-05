const express = require('express');
const wrap = require("../../../middleware/async-wrapper.js");
const models = require("../../../models");
var router = express.Router();

// Index
router.get("/", wrap(async (req, res) => {
    var publications = await models.Publication.findAsync({});

    return res.render("cms/publications/index", { publications: publications });
}));

// Create
router.get("/new", wrap(async (req, res) => {
    return res.render("cms/publications/new");
}));
router.post("/", wrap(async (req, res) => {
    var publication = req.body.publication;
    var created = await models.Publication.create(publication);

    return res.redirect("/cms/publications");
}));

// Update
router.get("/:id/edit", wrap(async (req, res) => {
    var id = req.params.id;
    var publication = await models.Publication.findByIdAsync(id);

    return res.render("cms/publications/edit", { publication: publication });
}));
router.put("/:id", wrap(async (req, res) => {
    var id = req.params.id;
    var publication = req.body.publication;
    var updated = await models.Publication.findByIdAndUpdateAsync(id, publication);

    return res.redirect("/cms/publications");
}));

// Delete
router.delete("/:id", wrap(async (req, res) => {
    var id = req.params.id;
    var publicationsContainer = await models.Container.findOne({ label: "Main-Publications" });
    var publication = publicationsContainer.objects.find((obj) => { return obj.item == id });

    if (publication) {
        const index = publicationsContainer.objects.indexOf(publication);
        if (index !== -1) {
            publicationsContainer.objects.splice(index, 1);
        }
        await publicationsContainer.save();
    }
    var deleted = await models.Publication.findByIdAndRemoveAsync(id);

    return res.redirect("/cms/publications");
}));

module.exports = router;