const { Router } = require("express")
const { addAmountToWallet, fetchWallet } = require("../Controllers/Wallet/wallet.controller.js")
const { verifyJWT } = require("../Middleware/auth.middleware.js")

const router = Router()


router.route("/add-amount").post(addAmountToWallet)
router.route("/").get(verifyJWT, fetchWallet)

module.exports = router