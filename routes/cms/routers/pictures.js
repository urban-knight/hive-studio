const express = require('express');
const wrap = require("../../../middleware/async-wrapper.js");
const models = require("../../../models");
var router = express.Router();

const fs = require('fs');
const { promisifyAll } = require('bluebird');
promisifyAll(fs);

// Index
router.get("/", wrap(async (req, res) => {
    var pictures = await models.Picture.findAsync();
    pictures.reverse();

    return res.render("cms/pictures/index", { pictures: pictures });
}));

router.get("/:id", wrap(async (req, res) => {
    var id = req.params.id;
    var picture = await models.Picture.findByIdAsync(id);

    res.setHeader('content-type', picture.contentType);
    return res.send(picture.data);
}));

// Create
router.post("/", wrap(async (req, res) => {
    if (!req.files) {
        res.status(500).send("No images recieved.");
    } else {
        var images = req.files;
        var ids = [];

        for (let image of images) {
            var template = {};
            template.contentType = image.mimetype;
            template.data = fs.readFileSync(image.path);
            var deleted = await fs.unlinkAsync(image.path);
            var picture = await models.Picture.create(template);
            ids.push(picture._id);
        }

        return res.status(200).send(ids);
    }
}));

// Delete
router.delete("/:id", wrap(async (req, res) => {
    var id = req.params.id;
    var page = await models.Page.findOneAsync({ picture: id });
    var project = await models.Page.findOneAsync({ picture: id });

    if (page) {
        return res.status(500).json({ error: "This picture is assigned to the page. Please re-assign the picture first.", id: page._id });
    } else if (project) {
        return res.status(500).json({ error: "This picture is assigned to the project. Please re-assign the picture first.", id: project._id });
    } else {
        var deleted = await models.Picture.findByIdAndRemoveAsync(req.params.id);
        return res.status(200).send("Deleted successfully");
    }
}));

module.exports = router;