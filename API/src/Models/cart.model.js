const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    items: [
        {
            productId: {
                type: String, // Assuming the product ID is a string
                required: true
            },
            skuId: {
                type: String,
                required: true
            },
            title: {
                type: String, 
                required: true
            },
            description: String,
            price: {
                type: String,
                required: true
            },
            image: {
                type: String,
                required: true
            },
            sizeId: {
                type: String,
                required: true
            },
            colorId: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                default: 1,
                required: true
            }
        }
    ],
    total: {
        type: Number,
        default: 0,
    },
    itemsQuantity: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

// Update model name to CartModel
const Cart = mongoose.models.cart || mongoose.model('cart', cartSchema);

module.exports =  Cart;
