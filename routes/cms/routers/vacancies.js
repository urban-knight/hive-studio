const express = require('express');
const wrap = require("../../../middleware/async-wrapper.js");
const models = require("../../../models");
var router = express.Router();

// Index
router.get("/", wrap(async (req, res) => {
    var vacancies = await models.Vacancy.findAsync({});

    return res.render("cms/vacancies/index", { vacancies: vacancies });
}));

// Create
router.get("/new", wrap(async (req, res) => {
    return res.render("cms/vacancies/new");
}));
router.post("/", wrap(async (req, res) => {
    var vacancy = req.body.vacancy;
    var created = await models.Vacancy.create(vacancy);

    return res.redirect("/cms/vacancies");
}));

// Update
router.get("/:id/edit", wrap(async (req, res) => {
    var id = req.params.id;
    var vacancy = await models.Vacancy.findByIdAsync(id);

    return res.render("cms/vacancies/edit", { vacancy: vacancy });
}));
router.put("/:id", wrap(async (req, res) => {
    var id = req.params.id;
    var vacancy = req.body.vacancy;
    var updated = await models.Vacancy.findByIdAndUpdateAsync(id, vacancy);

    return res.redirect("/cms/vacancies");
}));

// Delete
router.delete("/:id", wrap(async (req, res) => {
    var id = req.params.id;
    var vacanciesContainer = await models.Container.findOne({ label: "Main-Vacancies" });
    var vacancy = vacanciesContainer.objects.find((obj) => { return obj.item == id });

    if (vacancy) {
        const index = vacanciesContainer.objects.indexOf(vacancy);
        if (index !== -1) {
            vacanciesContainer.objects.splice(index, 1);
        }
        await vacanciesContainer.save();
    }
    var deleted = await models.Vacancy.findByIdAndRemoveAsync(id);

    return res.redirect("/cms/vacancies");
}));

module.exports = router;