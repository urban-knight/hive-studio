var mongoose = require("mongoose");

var ProjectSchema = mongoose.Schema({
    title: { type: String, default: "new title" },
    description: { type: String, default: "new description" },
    targets: { type: String, default: "new target" },
});

module.exports = mongoose.model("Service", ProjectSchema);
