const { promisifyAll } = require('bluebird');
const express = require('express');

const middleware = require("../middleware");
const wrap = require("../middleware/async-wrapper.js");

const router = express.Router();

// INDEX
router.get("/", wrap(async (req, res) => {
    
    return res.render("index");
}));

module.exports = router;