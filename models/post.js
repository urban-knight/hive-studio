var mongoose = require("mongoose");

var PostSchema = mongoose.Schema({
    url: { type: String },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    picture_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Picture"
    },
    title: { type: String },
    description: { type: String },
    body: { type: String },
    published: { type: Date },
    tags: [],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("Post", PostSchema);
