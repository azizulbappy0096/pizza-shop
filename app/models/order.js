const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    items: {
        type: Object,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    totalQty: {
        type: Number,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        default: "COD"
    },
    status: {
        type: String,
        default: "order_placed"
    }
    
}, {timestamps: true});

module.exports = mongoose.model("order", orderSchema)