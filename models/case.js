var mongoose = require("mongoose");

var CaseSchema = mongoose.Schema({
    en: {
        name: {type: String},
    },
    uk: {
        name: {type: String},
    },
    ru: {
        name: {type: String},
    }
});

module.exports = mongoose.model("Case", CaseSchema);
