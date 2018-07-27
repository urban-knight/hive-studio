var mongoose = require("mongoose");

var CategorySchema = mongoose.Schema({
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service"
    },
    en: {
        url: { type: String },
        name: { type: String }
    },
    ru: {
        url: { type: String },
        name: { type: String }
    },
    uk: {
        url: { type: String },
        name: { type: String }
    }
});

module.exports = mongoose.model("Category", CategorySchema);