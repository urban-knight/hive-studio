const express = require('express');
const wrap = require("../../../../middleware/async-wrapper.js");
const models = require("../../../../models");
const ContainerUtil = require("../../../../utils/container");
var router = express.Router();

router.get("/", wrap(async (req, res) => {
    var publicationsContainer = await models.Container.findOne({ label: "Main-Publications" }).populate({ path: 'objects.item'});
    var publications = await models.Publication.findAsync({});
    var selected = ContainerUtil.unload(publicationsContainer);

    var selectedIDs = [];
    for (let obj of selected) {
        selectedIDs.push(obj.id);
    }

    return res.render("cms/containers/publications", { selected: selectedIDs, publications: publications });
}));

// Pages Switch
router.post("/", wrap(async (req, res) => {
    var id = req.body.id;
    var publicationsContainer = await models.Container.findOne({ label: "Main-Publications" });
    var publication = publicationsContainer.objects.find((obj) => { return obj.item == id });

    if (!publication) {
        var obj = { kind: "Publication", item: id };
        publicationsContainer.objects.push(obj);
        await publicationsContainer.save();
        return res.status(200).send({ message: "Publication is switched on successfully" });
    } else {
        const index = publicationsContainer.objects.indexOf(publication);
        
        if (index !== -1) {
            publicationsContainer.objects.splice(index, 1);
        }

        await publicationsContainer.save();
        return res.status(200).send({ message: "Publication is switched off successfully" });
    }

}));

module.exports = router;