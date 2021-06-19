const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const userInput = new Schema({
    idme: {
        type: String,
        required: true,
    },
    keyword: {
        type: String,
        required: true,
        unique: true
    },
    source: {
        type: String,
        required: true,
    }




})

module.exports = mongoose.model("userInput", userInput);