const express = require('express');
const router = express.Router();
const models = require("./../models");
const wrap = require("../middleware/async-wrapper.js");

// Blog Index 
router.get('/', wrap(async (req, res) => {
    var data = {
        categories: await models.Category.find({}).populate("posts"),
        featured: await models.Post.find({}).sort({}).limit(5),
        langer: require("../lang/blog/" + res.locals.lang + ".json")
    }

    return res.render("blog/index", data);
}));

// Category
router.get('/:category_url', wrap(async (req, res) => {
    var perPage = 3;
    var page = req.query.page || 1;
    var url = req.params.category_url;
    var target = res.locals.lang + ".url";
    var category = await models.Category.findOne({ [target]: url });

    if (category) {
        models.Post.find({ "category": category._id })
            .sort({ published: -1 })
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .populate("category")
            .exec(function (err, posts) {
                models.Post.count().exec(function (err, count) {

                    res.render('blog/category/show', {
                        posts: posts,
                        current: page,
                        pages: Math.ceil(count / perPage),
                        category: category,
                        langer: require("../lang/blog/category/show/" + res.locals.lang + ".json")
                    });
                });
            });
    } else {
        return res.status(404).render("404");
    }

}));

// Blog view
router.get("/:category_url/:post_url", wrap(async (req, res) => {
    var post = await models.Post.findOne({ url: req.params.post_url }).populate("category");
    return res.render("blog/post/show",
        {
            post: post,
            langer: require("../lang/blog/post/show/" + res.locals.lang + ".json")
        });
}));

module.exports = router;
