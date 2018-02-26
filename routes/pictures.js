const express = require('express');
const router = express.Router();
const Picture = require("./../models/picture.js");
const wrap = require("../middleware/async-wrapper.js");

//PICTURES ROUTING
router.get("/:id", wrap(async (req, res) => {
    var id = req.params.id;

    var picture = await Picture.findByIdAsync(id);
    res.setHeader('content-type', picture.contentType);
    return res.send(picture.data);
}));

module.exports = router;
