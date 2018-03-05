const express = require('express');
const wrap = require("../../../middleware/async-wrapper.js");
const models = require("../../../models");
var router = express.Router();

const fs = require('fs');
const { promisifyAll } = require('bluebird');
promisifyAll(fs);
const mime = require('mime-types');
const mongoose = require('mongoose');
const db = require("../../../utils/db");
const Gridfs = require('gridfs-stream');

// Index
router.get("/", wrap(async (req, res) => {
    var db = mongoose.connection.db;
    var mongoDriver = mongoose.mongo;
    var gfs = new Gridfs(db, mongoDriver);
    promisifyAll(gfs);

    var documents = await models.Document.findAsync();
    documents.reverse();

    var files = [];
    for (let document of documents){
        var file = await gfs.findOneAsync({_id: document.fileID});
        files.push(file);
    }
    
    return res.render("cms/documents/index", { documents: documents, files: files });
}));

// Create
router.get("/new", wrap(async (req, res) => {
    return res.render("cms/documents/new");
}));
router.post('/upload', wrap(async (req, res) => {
    if (!req.files) {
        res.status(500).send("No files recieved.");
    } else {
        var db = mongoose.connection.db;
        var mongoDriver = mongoose.mongo;
        var gfs = new Gridfs(db, mongoDriver);

        var file = req.files[0];

        var writestream = gfs.createWriteStream({
            filename: file.filename,
            mode: 'w',
            content_type: file.mimetype,
            metadata: req.body
        });

        fs.createReadStream(file.path).pipe(writestream);

        writestream.on('close', function(new_file) {
            fs.unlink(file.path, function(err) {
                return res.status(200).json(new_file._id);
            });
        });
    }
}));
router.post('/', wrap(async (req, res) => {
    var document = req.body.document;
    var created = await models.Document.create(document);

    return res.redirect("/cms/documents");
}));

// Read
router.get('/download/:id', wrap(async (req, res) => {
    var db = mongoose.connection.db;
    var mongoDriver = mongoose.mongo;
    var gfs = new Gridfs(db, mongoDriver);
    promisifyAll(gfs);

    var file = await gfs.findOneAsync({_id: req.params.id});
    res.setHeader('content-type', file.contentType);
    res.set('Content-Disposition', "inline; filename=" + file.filename + "." + mime.extension(file.contentType));

    var readstream = gfs.createReadStream({
       _id: req.params.id
    });
    readstream.pipe(res);
    
}));

// Edit
router.get("/:id/edit", wrap(async (req, res) => {
    var id= req.params.id;
    var document = await models.Document.findByIdAsync(id);

    return res.render("cms/documents/edit", { document: document });
}));
router.put("/:id", wrap(async (req, res) => {
    var id = req.params.id;
    var document = req.body.document;
    var updated = await models.Document.findByIdAndUpdateAsync(id, document);

    return res.redirect("/cms/documents");
}));

// Delete
router.delete("/:id", wrap(async (req, res)=>{
    var db = mongoose.connection.db;
    var mongoDriver = mongoose.mongo;
    var gfs = new Gridfs(db, mongoDriver);
    promisifyAll(gfs);

    var document = await models.Document.findByIdAsync(req.params.id);
    var removed = await gfs.removeAsync({_id: document.fileID});
    var deleted = await models.Document.findByIdAndRemoveAsync(req.params.id);

    return res.redirect("/cms/documents");
}));

module.exports = router;