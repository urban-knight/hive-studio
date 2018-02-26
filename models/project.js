var mongoose = require("mongoose");

var ProjectSchema = mongoose.Schema({
    picture_id: { type: String, default: "." },
    business_case: { type: String, default: "new post" },
    done: { type: String, default: "new post" },
    tech_stack: { type: String, default: "new post" },
});

module.exports = mongoose.model("Project", ProjectSchema);
