var mongoose = require("mongoose");

var DatasetSchema = mongoose.Schema({
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
    model: { type: String },
    objects: { type: String }
});

module.exports = mongoose.model("Dataset", DatasetSchema);
