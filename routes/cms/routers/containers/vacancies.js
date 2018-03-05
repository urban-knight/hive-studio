const express = require('express');
const wrap = require("../../../../middleware/async-wrapper.js");
const models = require("../../../../models");
const ContainerUtil = require("../../../../utils/container");
var router = express.Router();

router.get("/", wrap(async (req, res) => {
    var vacanciesContainer = await models.Container.findOne({ label: "Main-Vacancies" }).populate({ path: 'objects.item'});
    var vacancies = await models.Vacancy.findAsync({});
    var selected = ContainerUtil.unload(vacanciesContainer);

    var selectedIDs = [];
    for (let obj of selected) {
        selectedIDs.push(obj.id);
    }

    return res.render("cms/containers/vacancies", { selected: selectedIDs, vacancies: vacancies });
}));

// Pages Switch
router.post("/", wrap(async (req, res) => {
    var id = req.body.id;
    var vacanciesContainer = await models.Container.findOne({ label: "Main-Vacancies" });
    var vacancy = vacanciesContainer.objects.find((obj) => { return obj.item == id });

    if (!vacancy) {
        var obj = { kind: "Vacancy", item: id };
        vacanciesContainer.objects.push(obj);
        await vacanciesContainer.save();
        return res.status(200).send({ message: "Vacancy is switched on successfully" });
    } else {
        const index = vacanciesContainer.objects.indexOf(vacancy);
        
        if (index !== -1) {
            vacanciesContainer.objects.splice(index, 1);
        }

        await vacanciesContainer.save();
        return res.status(200).send({ message: "Vacancy is switched off successfully" });
    }

}));

module.exports = router;