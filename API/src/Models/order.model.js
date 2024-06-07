const {Schema, model} = require('mongoose');

const itemSchema = new Schema({
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
    }
}, { _id: false });

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        index: true
    },
    items: [itemSchema],
    payment: {
        type: Schema.Types.ObjectId,
        ref: 'Payment',
        required: true
    },
    shippingAddress: {
        type: Schema.Types.ObjectId,
        ref: 'address',
        required: true
    },
    billNo: {
        type: String,
        index: true
    },
    totalPayAmount: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    totalBV: {
        type: Number,
        required: true
    },
    voucher: {
        type: Schema.Types.ObjectId,
        ref: 'Voucher'
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }
}, { timestamps: true });

const Order = model('Order', orderSchema);

module.exports = Order;
