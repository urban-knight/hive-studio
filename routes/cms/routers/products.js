const express = require('express');
const wrap = require("../../../middleware/async-wrapper.js");
const models = require("../../../models");
var router = express.Router();

// Index
router.get("/", wrap(async (req, res) => {
    var products = await models.Product.findAsync({});

    return res.render("cms/products/index", { products: products });
}));

// Create
router.get("/new", wrap(async (req, res) => {
    return res.render("cms/products/new");
}));
router.post("/", wrap(async (req, res) => {
    var product = req.body.product;
    var created = await models.Product.create(product);
    
    return res.redirect("/cms/products");
}));

// Update
router.get("/:id/edit", wrap(async (req, res) => {
    var id = req.params.id;
    var product = await models.Product.findByIdAsync(id);

    return res.render("cms/products/edit", { product: product });
}));
router.put("/:id", wrap(async (req, res) => {
    var id = req.params.id;
    var product = req.body.product;
    var updated = await models.Product.findByIdAndUpdateAsync(id, product);

    return res.redirect("/cms/products");
}));

// Delete
router.delete("/:id", wrap(async (req, res) => {
    var id = req.params.id;
    var deleted = await models.Product.findByIdAndRemoveAsync(id);

    return res.redirect("/cms/products");
}));

module.exports = router;