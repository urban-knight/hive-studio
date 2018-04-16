module.exports = {
    apply(app) {
        const multer = require('multer');
        const storage = require("../utils/storage.js");

        app.use(multer({ storage: storage }).any());
    }
};