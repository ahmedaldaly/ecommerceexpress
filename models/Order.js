
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        required: true,
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    product: {
        required: true,
        type: mongoose.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type:Number,
        default:1,
    },
    address: {
        type:String,
        default:'No titles added.',
    },
    stuts:{
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'canceled'], // القيم المسموح بها فقط
        default: 'pending' // قيمة افتراضية
    }
}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);

module.exports = { Order };
