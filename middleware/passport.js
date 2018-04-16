module.exports = {
    apply(app) {
        const passport = require('passport');
        const LocalStrategy = require('passport-local');
        const models = require("../models");

        app.use(passport.initialize());
        app.use(passport.session());
        passport.use(new LocalStrategy(models.User.authenticate()));
        passport.serializeUser(models.User.serializeUser());
        passport.deserializeUser(models.User.deserializeUser());
        app.use(async (req, res, next) => {
            res.locals.currentUser = req.user;
            next();
        });
    }
};