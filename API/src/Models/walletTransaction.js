const { Schema, model } = require("mongoose");

const walletTransactionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const WalletTransaction = model("WalletTransaction", walletTransactionSchema);

module.exports = WalletTransaction;
