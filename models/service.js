var mongoose = require("mongoose");

var ServiceSchema = mongoose.Schema({
    en: {
        url: {type: String},
        name: {type: String},
        desc: {type: String},
        ext_desc: {type: String}
    },
    uk: {
        url: {type: String},
        name: {type: String},
        desc: {type: String},
        ext_desc: {type: String}
    },
    ru: {
        url: {type: String},
        name: {type: String},
        desc: {type: String},
        ext_desc: {type: String}
    }
});

module.exports = mongoose.model("Service", ServiceSchema);
