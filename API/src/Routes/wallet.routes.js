const { Router } = require("express")
const { addAmountToWallet } = require("../Controllers/Wallet/wallet.controller.js")

const router = Router()


router.route("/add-amount").post(addAmountToWallet)

module.exports = router