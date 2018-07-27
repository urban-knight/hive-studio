var mongoose = require("mongoose");

var PageSchema = mongoose.Schema({
    en: {
        url: { type: String },
        name: { type: String },
        desc: { type: String },
        short_desc: { type: String },
        page_context: { type: String },
        keywords: []
    },
    uk: {
        url: { type: String },
        name: { type: String },
        desc: { type: String },
        short_desc: { type: String },
        page_context: { type: String },
        keywords: []
    },
    ru: {
        url: { type: String },
        name: { type: String },
        desc: { type: String },
        short_desc: { type: String },
        page_context: { type: String },
        keywords: []
        
    },
    view: { type: String },
    objects: []
});

module.exports = mongoose.model("Page", PageSchema);
