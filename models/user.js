var mongoose = require("mongoose");
var pasportLocalMongoose = require("passport-local-mongoose");

var UserSchema = mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(pasportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);