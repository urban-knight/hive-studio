var mongoose = require('mongoose');

var PictureSchema = new mongoose.Schema({
    contentType: { type: String, default: 'image/jpeg' },
    data: { type: Buffer}
});

module.exports = mongoose.model("Picture", PictureSchema);