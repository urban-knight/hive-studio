module.exports = {
    apply(app) {
        app.use((req, res, next) => {
            if (req.isAuthenticated()) {
                return next();
            } else {
                req.session.returnTo = "/cms" + req.url;
                res.redirect("/cms/login");
            }
        });
    }
};