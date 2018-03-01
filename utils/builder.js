const express = require('express');
const middleware = require("../middleware");
const wrap = require("../middleware/async-wrapper.js");

var mountPages = (pages)=>{
    const router = express.Router();

    for (i = 0; i< pages.length; i++){
        
        router.get("/" & pages[i], wrap(async (req, res) => {
        
            res.render(pages[i]);
        }));
    }
    return router;
}



module.exports = {
    mountPages: mountPages
}