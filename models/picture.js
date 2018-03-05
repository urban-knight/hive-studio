var mongoose = require('mongoose');

var PictureSchema = new mongoose.Schema({
    contentType: { type: String},
    data: { type: Buffer}
});

module.exports = mongoose.model("Picture", PictureSchema);