const { Router } = require("express")
const { verifyJWT } = require("../Middleware/auth.middleware.js")
const { createPayment, refundPayment } = require("../Controllers/Order & Payment/payment.controller.js")

const router = Router()


router.route("/make-payment").post(verifyJWT, createPayment)
router.route("/refund").post(verifyJWT, refundPayment)


module.exports = router