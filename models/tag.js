var mongoose = require("mongoose");

var TagSchema = mongoose.Schema({
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

module.exports = mongoose.model("Tag", TagSchema);
