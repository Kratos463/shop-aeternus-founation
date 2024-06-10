const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    startingPrice: {
        type: Number,
        required: true
    },
    endingPrice: {
        type: Number,
        required: true
    },
    discountPercentage: {
        type: Number,
        required: true
    }
});

const Discount = mongoose.model('Discount', discountSchema);

module.exports = Discount;
