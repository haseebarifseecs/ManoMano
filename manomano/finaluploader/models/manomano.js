const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const rank = new Schema({
    name: String,
    date: {
        type: Date,
        default: (new Date(Date.now())).toDateString(),
    },
    category: {
        type: String,
        required: true
    },
    pageUrl: {
        type: String,
        required: true
    },
    rank: {
        type: String,
        required: true
    },
    idme: {
        type: String,
        required: true
    },
    keyword: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true

    }



})

module.exports = mongoose.model("rank", rank);