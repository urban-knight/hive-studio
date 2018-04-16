module.exports = {
    apply(app) {
        const bodyParser = require('body-parser');
        const methodOverride = require('method-override');

        app.set("view engine", "ejs");
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(methodOverride("_method"));
    }
};