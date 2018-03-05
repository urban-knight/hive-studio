const express = require('express');
const wrap = require("../../../../middleware/async-wrapper.js");
const models = require("../../../../models");
const ContainerUtil = require("../../../../utils/container");
var router = express.Router();

router.get("/", wrap(async (req, res) => {
    var pagesContainer = await models.Container.findOne({ label: "Main-Pages" }).populate({ path: 'objects.item', populate: { path: 'category' } });
    var pages = await models.Page.findAsync({});
    var selected = ContainerUtil.unload(pagesContainer);

    var selectedIDs = [];
    for (let obj of selected) {
        selectedIDs.push(obj.id);
    }

    return res.render("cms/containers/pages", { selected: selectedIDs, pages: pages });
}));

// Pages Switch
router.post("/", wrap(async (req, res) => {
    var id = req.body.id;
    var pagesContainer = await models.Container.findOne({ label: "Main-Pages" });
    var page = pagesContainer.objects.find((obj) => { return obj.item == id });

    if (!page) {
        var obj = { kind: "Page", item: id };
        pagesContainer.objects.push(obj);
        await pagesContainer.save();
        return res.status(200).send({ message: "Page is switched on successfully" });
    } else {
        const index = pagesContainer.objects.indexOf(page);
        
        if (index !== -1) {
            pagesContainer.objects.splice(index, 1);
        }

        await pagesContainer.save();
        return res.status(200).send({ message: "Page is switched off successfully" });
    }

}));

module.exports = router;