const { promisifyAll } = require('bluebird');
const express = require('express');

const middleware = require("../middleware");
const wrap = require("../middleware/async-wrapper.js");

const router = express.Router();


// INDEX
router.get("/", wrap(async (req, res) => {
    
    return res.render("index");
}));

// ABOUT
router.get("/about", wrap(async (req, res) => {
    
    return res.render("about");
}));


// CONTACTS
router.get("/contacts", wrap(async (req, res) => {
    
    return res.render("contacts");
}));

// ORDER
router.get("/order", wrap(async (req, res) => {
    
    return res.render("order");
}));

// SUPPORT
router.get("/support", wrap(async (req, res) => {
    
    return res.render("support");
}));

module.exports = router;