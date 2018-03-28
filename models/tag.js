var mongoose = require("mongoose");

var TagSchema = mongoose.Schema({
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

module.exports = mongoose.model("Tag", TagSchema);
