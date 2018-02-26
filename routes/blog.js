const express = require('express');
const router = express.Router();
const Block = require("./../models/post.js");
const Category = require("./../models/category.js");
const wrap = require("../middleware/async-wrapper.js");


// Category view
router.get('/category/:category_url', wrap(async (req, res)=> {
    var perPage = 3;
    var page = req.query.page || 1;
    var url = req.params.category_url;
    var target = await Category.findOneAsync({url: url});

    Block.find({"category": target._id})
        .sort({ date: -1 })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .populate("category")
        .exec(function(err, blocks) {
            Block.count().exec(function(err, count) {

                res.render('blog/category', {
                    blocks: blocks,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    category: target
                });
            });
        });
}));

// Blog view
router.get("/:url", wrap(async (req, res) => {
    var block = await Block.findOne({url: req.params.url}).populate("category");
    return res.render("blog/show", { block: block });
}));

module.exports = router;
