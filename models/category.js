var mongoose = require("mongoose");

var CategorySchema = mongoose.Schema({
    url: { type: String, default: 'none' },
});

module.exports = mongoose.model("Category", CategorySchema);