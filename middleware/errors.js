module.exports = {
    apply(app) {
        app.use((err, req, res, next) => {
            console.warn(err.toString());
            res.status(500).send();
        });
    }
};
