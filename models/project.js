var mongoose = require("mongoose");

var ProjectSchema = mongoose.Schema({
    picture_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Picture"
    },
    business_case: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Case"
    },
    category: {
        kind: String,
        item: { type: mongoose.Schema.Types.ObjectId, refPath: 'category.kind' }
    },
    released: { type: Date },
    hours: {type: Number},
    en: {
        url: { type: String },
        name: { type: String },
        desc: { type: String },
        scope: []
    },
    uk: {
        url: { type: String },
        name: { type: String },
        desc: { type: String },
        scope: []
    },
    ru: {
        url: { type: String },
        name: { type: String },
        desc: { type: String },
        scope: []
    },
});

module.exports = mongoose.model("Project", ProjectSchema);
