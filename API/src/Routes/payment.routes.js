const { Router } = require("express")
const { verifyJWT } = require("../Middleware/auth.middleware.js")
const { createPayment } = require("../Controllers/Order & Payment/payment.controller.js")

const router = Router()


router.route("/make-payment").post(verifyJWT, createPayment)


module.exports = router