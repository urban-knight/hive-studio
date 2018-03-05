var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.session.returnTo = "/cms" + req.url;
        res.redirect("/cms/login");
    }
}

middlewareObj.error = function (err, req, res, next) {
    console.warn(err.toString());
    res.status(500).send();
}

module.exports = middlewareObj;