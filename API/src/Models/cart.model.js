const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
    },
    categoryId: String,
    productCode: String,
    title: String,
    skuId: String,
    stockQty: {
        type: String,
    },
    mediumFile: String,
    sizeId: String,
    colorId: String,
    gstPerFirst: {
        type: String,
    },
    gstPerSecond: {
        type: String,
    },
    hsnCode: String,
    regularPriceSelf: {
        type: String,
    },
    priceSelf: {
        type: String,
    },
    pointsAdjustedSelf: {
        type: String,
    },
    shippingChargesSelf: {
        type: String,
    },
    bvSelf: {
        type: String,
    },
    saveUptoSelf: {
        type: String,
    },
    regularPrice: {
        type: String,
    },
    pointsAdjusted: {
        type: String,
    },
    shippingCharges: {
        type: String,
    },
    bv: {
        type: String,
    },
    saveUpto: {
        type: String,
    },
    productUrl: String,
    quantity: {
        type: Number,
        default: 1,
        required: true,
        min: 1
    },
    price: {
        type: String,
        required: true
    },
    offerPrice: {
        type: Number,
        required: true
    },
    discountPercentage: {
        type: Number,
        required: true
    }
}, { _id: false });

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    items: [itemSchema],
    total: {
        type: Number,
        default: 0,
    },
    totalBV: {
        type: Number,
        default: 0

    },
    itemsQuantity: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

module.exports = Cart;
