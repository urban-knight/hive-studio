var mongoose = require("mongoose");

var PostSchema = mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    picture_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Picture"
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    published: { type: Date },
    en: {
        url: { type: String },
        title: { type: String },
        desc: { type: String },
        body: { type: String }
    },
    uk: {
        url: { type: String },
        title: { type: String },
        desc: { type: String },
        body: { type: String }
    },
    ru: {
        url: { type: String },
        title: { type: String },
        desc: { type: String },
        body: { type: String }
        
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
    }]
});

module.exports = mongoose.model("Post", PostSchema);
