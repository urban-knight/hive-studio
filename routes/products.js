const express = require('express');
const router = express.Router();
const models = require("./../models");
const wrap = require("../middleware/async-wrapper.js");

// Index
router.get("/", wrap(async (req, res) => {
    var data = {
        products: await models.Product.findAsync({}).map(a => a[res.locals.lang]),
        langer: require("../lang/products/index/" + res.locals.lang + ".json")
    }

    return res.render("products/index", data);
}));

// Show
router.get("/:url", wrap(async (req, res) => {
    var obj = await models.Product.findOneAsync({ [res.locals.lang + ".url"]: req.params.url });
    var data = {
        product: obj[res.locals.lang],
        langer: require("../lang/products/show/" + res.locals.lang + ".json")
    }

    return res.render("products/show", data);
}));

module.exports = router;