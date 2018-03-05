const express = require('express');
const wrap = require("../../../middleware/async-wrapper.js");
const models = require("../../../models");
const ContainerUtil = require("../../../utils/container");
var router = express.Router();

// Index page
router.get("/", wrap(async (req, res) => {
    var catalogue = await models.Container.findOne({ label: "Catalogue" }).populate({path: 'objects.item', populate: { path: 'pages' }});
    var categories = ContainerUtil.unload(catalogue);
    var inactive_pages = await models.Page.findAsync({isActive: false});

    return res.render("cms/catalogues/index", { catalogue: catalogue, categories: categories, inactive_pages: inactive_pages });
}));

// Categories Swap
router.post("/swap-categories", wrap(async (req, res) => {
    var session = req.body.session;
    var catalogue = await models.Container.findOneAsync({ label: "Catalogue" });

    Array.prototype.move = function (old_index, new_index) {
        if (new_index >= this.length) {
            var k = new_index - this.length;
            while ((k--) + 1) {
                this.push(undefined);
            }
        }
        this.splice(new_index, 0, this.splice(old_index, 1)[0]);
        return this;
    };

    if (session.startIndex != session.stopIndex) {
        catalogue.objects.move(session.startIndex, session.stopIndex);
        await catalogue.save();

    }

    return res.status(200).send({ message: "Categories are swapped successfully" });
}));

// Pages Swap
router.post("/swap-pages", wrap(async (req, res) => {
    var session = req.body.session;

    Array.prototype.move = function (old_index, new_index) {
        if (new_index >= this.length) {
            var k = new_index - this.length;
            while ((k--) + 1) {
                this.push(undefined);
            }
        }
        this.splice(new_index, 0, this.splice(old_index, 1)[0]);
        return this;
    };
    if (session.startID == "inactive"){
        var page = await models.Page.findByIdAsync(session.pageID);
            page.isActive = true;
        await page.save();
    } else {
        var startCategory = await models.Category.findByIdAsync(session.startID);
    }

    if (session.startID != "inactive" && session.startID == session.stopID) {
        startCategory.pages.move(session.startIndex, session.stopIndex);
        await startCategory.save();

    } else {
        var stopCategory = await models.Category.findByIdAsync(session.stopID);
        var page = await models.Page.findByIdAsync(session.pageID);
        var updated = await models.Page.findByIdAndUpdateAsync(session.pageID, { category: stopCategory });

        if (session.startID != "inactive"){
            var wiped = await models.Category.update({ _id: session.startID }, { $pull: { pages: session.pageID } });
        } 
        
        stopCategory.pages.push(page);
        stopCategory.pages.move(stopCategory.pages.indexOf(page), session.stopIndex);
        await stopCategory.save();
    }

    return res.status(200).send({ message: "Pages are swapped successfully" });
}));

router.use("/categories", require("./categories"));
router.use("/pages", require("./pages"));

module.exports = router;