module.exports = {
    apply(app) {
        const session = require('express-session');
        const cookieParser = require('cookie-parser');

        app.use(cookieParser("hive-studio"));
        app.use(session({
            secret: "hive-studio",
            resave: false,
            saveUninitialized: false,
        }));
    }
};