var mongoose = require("mongoose");

var CategorySchema = mongoose.Schema({
    url: { type: String},
});

module.exports = mongoose.model("Category", CategorySchema);