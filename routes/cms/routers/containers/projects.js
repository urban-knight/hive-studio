const express = require('express');
const wrap = require("../../../../middleware/async-wrapper.js");
const models = require("../../../../models");
const ContainerUtil = require("../../../../utils/container");
var router = express.Router();

router.get("/", wrap(async (req, res) => {
    var projectsContainer = await models.Container.findOne({ label: "Main-Projects" }).populate({ path: 'objects.item', populate: { path: 'pages' } });
    var projects = await models.Project.findAsync({});
    var selected = ContainerUtil.unload(projectsContainer);

    var selectedIDs = [];
    for (let obj of selected) {
        selectedIDs.push(obj.id);
    }

    return res.render("cms/containers/projects", { selected: selectedIDs, projects: projects });
}));

// Pages Switch
router.post("/", wrap(async (req, res) => {
    var id = req.body.id;
    var projectsContainer = await models.Container.findOne({ label: "Main-Projects" });
    var project = projectsContainer.objects.find((obj) => { return obj.item == id });

    if (!project) {
        var obj = { kind: "Project", item: id };
        projectsContainer.objects.push(obj);
        await projectsContainer.save();
        return res.status(200).send({ message: "Project is switched on successfully" });
    } else {
        const index = projectsContainer.objects.indexOf(project);
        
        if (index !== -1) {
            projectsContainer.objects.splice(index, 1);
        }

        await projectsContainer.save();
        return res.status(200).send({ message: "Project is switched off successfully" });
    }

}));

module.exports = router;