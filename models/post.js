var mongoose = require("mongoose");

var PostSchema = mongoose.Schema({
    picture_id: { type: String, default: "." },
    title: { type: String, default: "new title" },
    description: { type: String, default: "new description" },
    author: { type: String, default: "hive" },
    tags: { type: String, default: "tag" },
    category: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    }
});

module.exports = mongoose.model("Post", ProjectSchema);
