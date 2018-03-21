var mongoose = require("mongoose");

var CategorySchema = mongoose.Schema({
    url: { type: String },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    en: {
        name: { type: String }
    },
    ru: {
        name: { type: String }
    },
    ua: {
        name: { type: String }
    }
});

module.exports = mongoose.model("Category", CategorySchema);