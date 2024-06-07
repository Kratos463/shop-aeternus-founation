const { Router } = require("express")
const { createVoucher, useVoucher, displayVouchers } = require("../Controllers/voucher/voucher.controller")
const { verifyJWT } = require("../Middleware/auth.middleware")

const router = Router()


router.route("/create-vouchers").post(createVoucher)
router.route("/use-voucher").post(verifyJWT, useVoucher)
router.route("/get-vouchers").get(displayVouchers)

module.exports = router 