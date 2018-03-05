var mongoose = require("mongoose");

var ProductSchema = mongoose.Schema({
    en: {
        picture_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Picture"
        },
        url: { type: String },
        name: { type: String },
        price: { type: String },
        desc: { type: String },
        ext_desc: {type: String}
    },
    ru: {
        picture_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Picture"
        },
        url: { type: String },
        name: { type: String },
        price: { type: String },
        desc: { type: String },
        ext_desc: {type: String}
    },
    ua: {
        picture_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Picture"
        },
        url: { type: String },
        name: { type: String },
        price: { type: String },
        desc: { type: String },
        ext_desc: {type: String}
    },

});

module.exports = mongoose.model("Product", ProductSchema);
