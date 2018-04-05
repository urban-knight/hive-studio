const express = require('express');
const wrap = require("../../../../middleware/async-wrapper.js");
const models = require("../../../../models");
var router = express.Router();

// Index page
router.get("/", wrap(async (req, res) => {
    var categories = await models.Category.find({}).populate("service");

    return res.render("cms/blog/index", { categories: categories });
}));

router.use("/tags", require("./tags"));
router.use("/posts", require("./posts"));
router.use("/featured", require("./featured"));
router.use("/categories", require("./categories"));

module.exports = router;