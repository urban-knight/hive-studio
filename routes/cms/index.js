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

router.use(middleware.isLoggedIn);

router.get("/", wrap(async (req, res) => {
    var counter = {};

    for (index of indexes) {
        index.counter = await models[index.model].count();
    }
      
    res.render("cms/index", {counter: counter, indexes: indexes});
}));

//router.use("/projects", routers.Project);

module.exports = router;