const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: {type: String, required: true},
    price: {type: String, required: true},
    size: {type: String, required: true}
});

module.exports = mongoose.model("menu", menuSchema)