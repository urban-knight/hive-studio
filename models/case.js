var mongoose = require("mongoose");

var CaseSchema = mongoose.Schema({
    en: {
        name: {type: String},
    },
    ua: {
        name: {type: String},
    },
    ru: {
        name: {type: String},
    }
});

module.exports = mongoose.model("Case", CaseSchema);
