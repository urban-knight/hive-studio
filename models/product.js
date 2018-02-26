var mongoose = require("mongoose");

var ProjectSchema = mongoose.Schema({
    picture_id: { type: String, default: "." },
    description: { type: String, default: "new description" },
    scope: { type: String, default: "new scope" },
});

module.exports = mongoose.model("Product", ProjectSchema);
