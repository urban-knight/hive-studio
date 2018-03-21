const multer = require('multer');
const path = require('path');

const uploadPath = "/uploads";

var destination = function (req, file, callback) {
    var _path = path.join(appRoot, uploadPath);

    return callback(null, _path);
}

var filename = function (req, file, callback) {
    var parsed = path.parse(file.originalname);
    var _fileName = parsed.name.replace(/ /g, "_");

    return callback(null, _fileName);
}

var storage = multer.diskStorage({
    destination: destination,
    filename: filename
})

module.exports = storage;