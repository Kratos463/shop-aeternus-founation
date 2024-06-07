const {Schema, model} = require("mongoose")

const walletSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    amount: {
        type: Number,
        required: true,
        default: 0
    }
})

const Wallet = model("wallet", walletSchema)

module.exports = Wallet