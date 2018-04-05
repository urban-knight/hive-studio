var mongoose = require("mongoose");

var PageSchema = mongoose.Schema({
    en: {
        url: { type: String },
        title: { type: String },
        desc: { type: String },
        
    },
    ua: {
        url: { type: String },
        title: { type: String },
        desc: { type: String },
        view: { type: String }
    },
    ru: {
        url: { type: String },
        title: { type: String },
        desc: { type: String },
        view: { type: String }
        
    },
    view: { type: String },
    objects: [],
    models: []
});

module.exports = mongoose.model("Page", PageSchema);
