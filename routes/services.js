const express = require('express');
const router = express.Router();
const Block = require("./../models/service.js");
const wrap = require("../middleware/async-wrapper.js");

// SERVICES ROUTING
router.get("/:url", wrap(async (req, res) => {
    return res.render("services/show", { block: block });
}));

module.exports = router;
