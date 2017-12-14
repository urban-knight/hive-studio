var middlewareObj = {};

middlewareObj.error = function (err, req, res, next) {
    console.warn(err.toString());
    res.status(500).send();
}

module.exports = middlewareObj;