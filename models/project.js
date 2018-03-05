var mongoose = require("mongoose");

var ProjectSchema = mongoose.Schema({
    en: {
        picture_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Picture"
        },
        url: { type: String },
        name: { type: String },
        released: { type: Date },
        category: {
            name: {type: String},
            subcategory: {type: String}
        },
        business_case: { type: String},
        tech_stack: [{
            name: {type: String},
            icon: {type: String}
        }]
    },
    ru: {
        picture_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Picture"
        },
        url: { type: String },
        name: { type: String },
        released: { type: Date },
        category: {
            name: {type: String},
            subcategory: {type: String}
        },
        business_case: { type: String},
        tech_stack: [{
            name: {type: String},
            icon: {type: String}
        }]
    },
    ua: {
        picture_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Picture"
        },
        url: { type: String },
        name: { type: String },
        released: { type: Date },
        category: {
            name: {type: String},
            subcategory: {type: String}
        },
        business_case: { type: String},
        tech_stack: [{
            name: {type: String},
            icon: {type: String}
        }]
    }
});

module.exports = mongoose.model("Project", ProjectSchema);
