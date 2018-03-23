const express = require('express');
const wrap = require("../../../middleware/async-wrapper.js");
const models = require("../../../models");
var router = express.Router();

// Create
router.get("/new", wrap(async (req, res) => {
    return res.render("cms/cases/new");
}));
router.post("/", wrap(async (req, res) => {
    var business_case = req.body.business_case;
    var created = await models.Case.create(business_case);

    return res.redirect("/cms/projects");
}));

// Update
router.get("/:id/edit", wrap(async (req, res) => {
    var id = req.params.id;
    var business_case = await models.Case.findByIdAsync(id);

    return res.render("cms/cases/edit", { business_case: business_case});
}));
router.put("/:id", wrap(async (req, res) => {
    var id = req.params.id;
    var business_case = req.body.business_case;
    var updated = await models.Case.findByIdAndUpdateAsync(id, business_case);

    return res.redirect("/cms/projects");
}));

// Delete
router.delete("/:id", wrap(async (req, res) => {
    var id = req.params.id;
    var deleted = await models.Case.findByIdAndRemoveAsync(id);

    return res.redirect("/cms/projects");
}));

module.exports = router;