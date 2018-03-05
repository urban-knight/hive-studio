const express = require('express');
const wrap = require("../../../middleware/async-wrapper.js");
const models = require("../../../models");
var router = express.Router();

// Create
router.get("/new", wrap(async (req, res) => {
    return res.render("cms/categories/new");
}));
router.post("/", wrap(async (req, res) => {
    var category = req.body.category;
    var existing = await models.Category.findOneAsync({ url: category.url });
    if (existing) {
        return res.redirect("/cms/catalogue");
    } else {
        var created = await models.Category.createAsync(category);

        var uniq_url = "lorem-" + Math.floor(Math.random() * 100);
        var template = {
                url: uniq_url,
                name: "Lorem Ipsum",
                description: "This is a basic template of a page",
                picture: "5a380d146f1aa412c07e7941",
                body: "<p>Lorem ipsum todor amet sia</p>"
            };

        var demopage = await models.Page.createAsync(template);
        created.pages.push(demopage);
        await created.save();

        var catalogue = await models.Container.findOne({ label: "Catalogue" });
        catalogue.objects.push({kind:"Category", item: created._id});
        await catalogue.save();
        console.log("Category added: " + category.name);

        return res.redirect("/cms/catalogue");
    }
}));

// Edit
router.get("/:id/edit", wrap(async (req, res) => {
    var id= req.params.id;
    var category = await models.Category.findByIdAsync(id);

    return res.render("cms/categories/edit", { category: category });
}));
router.put("/:id", wrap(async (req, res) => {
    var id = req.params.id;
    var category = req.body.category;
    var updated = await models.Category.findByIdAndUpdateAsync(id, category);

    return res.redirect("/cms/catalogue");
}));

// Delete
router.delete("/:id", wrap(async (req, res) => {
    var id = req.params.id;
    var category = await models.Category.findById(id).populate('pages');

    for (page of category.pages){
        page.isActive = false;
        await page.save();
    }

    var catalogue = await models.Container.findOne({ label: "Catalogue" });
    var found = catalogue.objects.find((obj) => { return obj.item == id });

    if (found) {
        const index = catalogue.objects.indexOf(found);
        if (index !== -1) {
            catalogue.objects.splice(index, 1);
        }
        await catalogue.save();
    }

    var deleted = await models.Category.findByIdAndRemoveAsync(id);

    return res.redirect("/cms/catalogue");
}));


// --- CMS CATEGORY PAGES --- //

//CMS Page modification
router.get("/:id/pages/edit", function (req, res) {
    var index = req.query.pageIndex;
    Category.findById(req.params.id, function (err, category) {
        if (err) {
            console.log(err);
            res.redirect("/cms/categories");
        } else {
            fs.readFile(__dirname + "/" + './../../views/category/page/bodies/' + category.active_pages[index].body, 'utf-8', function (err, body) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("cms/categories/pages/edit", { category: category, page: category.active_pages[index], index: index, body: body });
                }
            });
        }
    });
});
router.put("/:id/pages", function (req, res) {
    var index = req.query.pageIndex;
    var _page = {
        url: req.body.url,
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        body: req.body.url_body
    };
    Category.findById(req.params.id, function (err, category) {
        if (err) {
            console.log(err);
            res.redirect("/cms/categories");
        } else {
            category.active_pages[index] = _page;
            fs.writeFile(__dirname + "/" + './../../views/category/page/bodies/' + category.active_pages[index].body, req.body.file_body, 'utf-8', function (err, body) {
                if (err) {
                    console.log(err);
                } else {
                    category.save();
                    res.redirect("/cms/categories/" + req.params.id);
                }
            });
        }
    });
});
router.put("/:id/pages/uploadPhoto", async (req, res) => {
    var index = req.query.pageIndex;
    var id = req.params.id;
    if (!req.files) {
        res.status(500).send("No images recieved.");
    } else {
        try {
            var category = await Category.findByIdAsync(id);
            var image = req.files[0];
            var data = fs.readFileSync(image.path);
            var contentType = image.mimetype;
            fs.unlink(image.path);
            FileLoader.loadPicture(data, contentType, (err, picture) => {
                category.picture = picture;
                category.save();
                return res.send(category.picture._id);
            });
        } catch (err) {
            return res.status(500).send(err);
        }
    }
});


//CMS Page creating
router.get("/:id/pages/new", function (req, res) {
    Category.findById(req.params.id, function (err, category) {
        if (err) {
            console.log(err);
            res.redirect("/cms/categories");
        } else {
            fs.readFile(__dirname + "/" + './../../views/category/page/bodies/template.html', 'utf-8', function (err, body) {
                if (err) {
                    console.log(err);
                    res.redirect("/cms/categories/" + req.params.id);
                } else {
                    res.render("cms/categories/pages/new", { category: category, body: body });
                }
            });
        }
    });
});
router.post("/:id/pages", function (req, res) {
    var _page = {
        url: req.body.url,
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        body: req.body.url_body
    };
    Category.findById(req.params.id, function (err, category) {
        if (err) {
            console.log(err);
            res.redirect("/cms/categories");
        } else {
            category.active_pages.push(_page);
            category.save();
            res.redirect("/cms/categories/" + req.params.id);
        }
    });
});

//CMS Page deactivating
router.put("/:id/pages/deactivate", function (req, res) {
    var index = req.query.pageIndex;
    var page;
    Category.findById(req.params.id, function (err, category) {
        if (err) {
            console.log(err);
            res.redirect("/cms/categories");
        } else {
            page = category.active_pages.splice(index, 1)[0];
            category.inactive_pages.push({ index: index, page: page });
            category.save();
            res.redirect("/cms/categories/" + req.params.id);
        }
    });
});

//CMS Page activating
router.put("/:id/pages/activate", function (req, res) {
    var index = req.query.pageIndex;
    var object;
    Category.findById(req.params.id, function (err, category) {
        if (err) {
            console.log(err);
            res.redirect("/cms/categories");
        } else {
            object = category.inactive_pages.splice(index, 1)[0];
            category.active_pages.splice(object.index, 0, object.page);
            category.save();
            res.redirect("/cms/categories/" + req.params.id);
        }
    });
});

//CMS Page erasing
router.delete("/:id/pages", function (req, res) {
    var index = req.query.pageIndex;
    Category.findById(req.params.id, function (err, category) {
        if (err) {
            console.log(err);
            res.redirect("/cms/categories");
        } else {
            category.inactive_pages.splice(index, 1);
            category.save();
            res.redirect("/cms/categories/" + req.params.id);
        }
    });
});

module.exports = router;