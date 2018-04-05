const express = require('express');
const wrap = require("../../../../middleware/async-wrapper.js");
const models = require("../../../../models");
const ContainerUtil = require("../../../../utils/container");
var router = express.Router();

// Index
router.get("/", wrap(async (req, res) => {
    var featured = await models.Container.findOne({ label: "Featured" }).populate({ path: 'objects.item', populate: { path: 'posts' } });
    
    if (featured) var posts = ContainerUtil.unload(featured);

    return res.render("cms/blog/featured/index", { posts: posts });
}));

// Post Swap
router.post("/swap", wrap(async (req, res) => {
    var session = req.body.session;
    var featured = await models.Container.findOneAsync({ label: "Featured" });

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
        featured.objects.move(session.startIndex, session.stopIndex);
        await featured.save();

    }

    return res.status(200).send({ message: "Posts are swapped successfully" });
}));

// Plain Search
router.get("/search", wrap(async (req, res) => {

    if (req.query.title) {
        var posts = await models.Post.findAsync({ "en.title": { $regex: "^" + req.query.title, $options: 'i' } });
    }

    if (req.query.id) {
        var post = await models.Post.findByIdAsync(req.query.id);

        return res.json(post);
    }

    return res.json(posts);
}));


// Add to Featured
router.post("/:id", wrap(async (req, res) => {
    var id = req.params.id;
    var post = await models.Post.findByIdAsync(id);

    if (post) {
        var featured = await models.Container.findOneAsync({ label: "Featured" });
        featured.objects.push({kind: "Post", item: id});
        await featured.save();

        return res.status(200).send({ message: "Post successfully added to featured." });
    } else {
        return res.status(500).send({ message: "Post not found." });
    }
}));

// Remove from Featured
router.delete("/:id", wrap(async (req, res) => {
    var postID = req.params.id;

    Array.prototype.remove = function () {
        var what, a = arguments, L = a.length, ax;
        while (L && this.length) {
            what = a[--L];
            while ((ax = this.indexOf(what)) !== -1) {
                this.splice(ax, 1);
            }
        }
        return this;
    };

    var featured = await models.Container.findOneAsync({ label: "Featured" });
    var posts = ContainerUtil.unload(featured);
    var index = posts.indexOf(postID);

    featured.objects.splice(index, 1);
    await featured.save();

    return res.redirect("/cms/blog/featured");

}));
module.exports = router;