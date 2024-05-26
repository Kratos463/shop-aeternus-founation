const mongoose = require("mongoose")

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    items: [
        {
            productId: {
                type: String,
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
        }
    ],
}, { timestamps: true });

const Wishlist = mongoose.models.wishlist || mongoose.model('wishlist', wishlistSchema);

module.exports = Wishlist;
