const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default:1,
    },
    address: {
        type: String,
        required: true,
        trim: true,
        minlength: 5
    },
    status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered'],
        default: 'pending'
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

function validateOrder(obj) {
    const schema = Joi.object({
        user: Joi.objectId().required(),
        product: Joi.objectId().required(),
        quantity: Joi.number().required(),
        address: Joi.string().required().trim().min(5),
        status: Joi.string().valid('pending', 'shipped', 'delivered').default('pending')
    });
    return schema.validate(obj);
}
function validateOrderUpdate(obj) {
    const schema = Joi.object({
        status: Joi.string().valid('pending', 'shipped', 'delivered').default('pending')
    });

    return schema.validate(obj);
}

module.exports = {
    Order,
    validateOrder,
    validateOrderUpdate,
};