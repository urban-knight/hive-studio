module.exports = {
    apply(app) {
        const path = require('path');
        const config = require("../config/app.json");
        const langer = require("../utils/langer");

        global.langs = config.langs;

        app.use(langer({
            translationsPath: path.join(appRoot, config.langPath),
            siteLangs: config.langs,
            textsVarName: config.langVar,
            cookieLangName: config.langCookie,
        }));
    }
};