var mongoose = require("mongoose");

var ProductSchema = mongoose.Schema({
    en: {
        url: { type: String },
        name: { type: String },
        price: { type: String },
        desc: { type: String },
        ext_desc: {type: String}
    },
    ru: {
        url: { type: String },
        name: { type: String },
        price: { type: String },
        desc: { type: String },
        ext_desc: {type: String}
    },
    ua: {
        url: { type: String },
        name: { type: String },
        price: { type: String },
        desc: { type: String },
        ext_desc: {type: String}
    },

});

module.exports = mongoose.model("Product", ProductSchema);
