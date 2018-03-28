const fs = require('fs');
const express = require('express');
const passport = require('passport');
const middleware = require("../../middleware");
const wrap = require("../../middleware/async-wrapper.js");
 
const models = require("../../models");
const routers = require("./routers");

const builder = require("../../utils/builder.js");
const config = require("../../config/app.json");

var pages = builder.extractPages(config.pages);
var indexes = builder.extractIndexes(config.indexes, config.indexTarget);

var router  = express.Router();

// --- CMS LOGIN SYSTEM --- //
router.get("/login",  wrap(async (req, res) => {
    res.render("cms/login");
}));
router.post("/login", passport.authenticate("local", 
    {
        successReturnToOrRedirect: "/cms", 
        failureRedirect: "/cms/login"
    }),  wrap(async (req, res) => {
}));
router.use(middleware.isLoggedIn);
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/cms/login");
});

router.get("/settings", wrap(async (req, res) => {
    res.render("cms/settings", {user: req.user});
}));
router.put("/settings", wrap(async (req, res) => {
    var user = await models.User.findByIdAsync(req.body.user.id);
    var updated = await models.User.update({_id: user._id}, {username: req.body.user.username});
        user.setPassword(req.body.user.password, async(err)=>{
            await user.save();
            res.redirect("/cms");
        });
}));

router.get("/", wrap(async (req, res) => {
    var counter = {
        services: await models.Service.find({}).count(),
        products: await models.Product.find({}).count(),
        projects: await models.Project.find({}).count(),
        posts: await models.Post.find({}).count(),
        pictures: await models.Picture.find({}).count(),
    }
      
    res.render("cms/index", {counter: counter});
}));

router.use("/blog", routers.Blog);
router.use("/services", routers.Service);
router.use("/products", routers.Product);
router.use("/pictures", routers.Picture);
router.use("/projects", routers.Project);
router.use("/business-cases", routers.Case);

module.exports = router;