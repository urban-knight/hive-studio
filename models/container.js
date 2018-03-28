var mongoose = require('mongoose');

var ContainerSchema = new mongoose.Schema({
    label: String,
    objects: [{
        kind: String,
        item: { type: mongoose.Schema.Types.ObjectId,
             refPath: 'objects.kind' }
    }]
});

module.exports = mongoose.model("Container", ContainerSchema);