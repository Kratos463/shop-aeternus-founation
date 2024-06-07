const { Router } = require("express")
const { verifyJWT } = require("../Middleware/auth.middleware.js")
const { createOrder, getOrderDetails, gettingBillDetailsForMFVUser, gettingBillDetailsForMFVUserByDate } = require("../Controllers/Order & Payment/order.controller.js")

const router = Router()


router.route("/make-order").post(verifyJWT, createOrder)
router.route("/get-order-details/:identifier").get(getOrderDetails)
router.route("/mfv-order").get(gettingBillDetailsForMFVUser)
router.route("/mfv-orders").get(gettingBillDetailsForMFVUserByDate)


module.exports = router