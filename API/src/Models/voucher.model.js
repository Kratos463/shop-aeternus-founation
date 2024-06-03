const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        index: true,
    },
    vouchers: [
        {
            cost: {
                type: Number,
                default: 6
            },
            code: {
                type: String,
                required: true,
                unique: true,
            },
            isUsed: {
                type: Boolean,
                default: false,
            },
            isExpired: {
                type: Boolean,
                default: false
            },
            expiresAt: {
                type: Date,
                default: () => Date.now() + 365 * 24 * 60 * 60 * 1000 // 1 year from creation
            }
        }
    ]
}, { timestamps: true });


const Voucher = mongoose.models.vouchers || mongoose.model("vouchers", voucherSchema)


module.exports = Voucher