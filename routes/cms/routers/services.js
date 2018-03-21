const express = require('express');
const wrap = require("../../../middleware/async-wrapper.js");
const models = require("../../../models");
var router = express.Router();

// Index
router.get("/", wrap(async (req, res) => {
    var services = await models.Service.findAsync({});

    return res.render("cms/services/index", { services: services });
}));

// Create
router.get("/new", wrap(async (req, res) => {
    return res.render("cms/services/new");
}));
router.post("/", wrap(async (req, res) => {
    var service = req.body.service;
    var created = await models.Service.create(service);

    return res.redirect("/cms/services");
}));

// Update
router.get("/:id/edit", wrap(async (req, res) => {
    var id = req.params.id;
    var service = await models.Service.findByIdAsync(id);
    var pictures = await models.Picture.findAsync({});

    return res.render("cms/services/edit", { service: service, pictures: pictures });
}));
router.put("/:id", wrap(async (req, res) => {
    var id = req.params.id;
    var service = req.body.service;
    var updated = await models.Service.findByIdAndUpdateAsync(id, service);

    return res.redirect("/cms/services");
}));

// Delete
router.delete("/:id", wrap(async (req, res) => {
    var id = req.params.id;
    var deleted = await models.Service.findByIdAndRemoveAsync(id);

    return res.redirect("/cms/services");
}));

module.exports = router;