const express = require('express');
const wrap = require("../../../../middleware/async-wrapper.js");
const models = require("../../../../models");
var router = express.Router();

// Create
router.get("/new", wrap(async (req, res) => {
    var catID = req.query.catID;
    if (catID){
        var category = await models.Category.findByIdAsync(catID);
    }
    var categories = await models.Category.findAsync();
    var pictures = await models.Picture.findAsync();
    var tags = await models.Tag.findAsync();

    return res.render("cms/blog/posts/new", { activeCategory: category, categories: categories, pictures: pictures, tags: tags });
}));
router.post("/", wrap(async (req, res) => {
    var post = req.body.post;
        post.tags = JSON.parse(post.tags);
    var created = await models.Post.create(post);
    var category = await models.Category.findByIdAsync(post.category);
    category.posts.push(created._id);
    await category.save();

    return res.redirect("/cms/blog/categories/" + post.category);
}));

// Update
router.get("/:id/edit", wrap(async (req, res) => {
    var id = req.params.id;
    var post = await models.Post.findById(id).populate("category");

    var categories = await models.Category.findAsync();
    var pictures = await models.Picture.findAsync();
    var tags = await models.Tag.findAsync();

    return res.render("cms/blog/posts/edit", { post: post, categories: categories, pictures: pictures, tags: tags });
}));
router.put("/:id", wrap(async (req, res) => {
    var id = req.params.id;
    var post = req.body.post;
        post.tags = JSON.parse(post.tags);
    var updated = await models.Post.findByIdAndUpdateAsync(id, post);

    return res.redirect("/cms/blog/categories/" + post.category);
}));

// Delete
router.delete("/:id", wrap(async (req, res) => {
    var id = req.params.id;
    var post = await models.Post.findByIdAsync(id);
    var category = await models.Category.findByIdAsync(post.category);
    category.posts.splice(category.posts.indexOf(id), 1);
    await category.save();
    var deleted = await models.Post.findByIdAndRemoveAsync(id);

    return res.redirect("/cms/blog");
}));

module.exports = router;