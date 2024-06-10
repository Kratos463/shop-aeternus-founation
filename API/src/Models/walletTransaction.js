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
}, {timestamps: true});

const WalletTransaction = model("WalletTransaction", walletTransactionSchema);

module.exports = WalletTransaction;
