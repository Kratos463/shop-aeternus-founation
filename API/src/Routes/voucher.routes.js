const { Router } = require("express")
const { createVoucher, useVoucher } = require("../Controllers/voucher/voucher.controller")
const { verifyJWT } = require("../Middleware/auth.middleware")

const router = Router()


router.route("/create-voucher").post(createVoucher)
router.route("/use-voucher").post(verifyJWT, useVoucher)

module.exports = router