const { Router } = require("express")
const { verifyJWT } = require("../Middleware/auth.middleware.js")
const { createOrder, getOrderDetails, gettingBillDetailsForMFVUser, gettingBillDetailsForMFVUserByDate, getUserOrderDetails } = require("../Controllers/Order & Payment/order.controller.js")

const router = Router()


router.route("/make-order").post(verifyJWT, createOrder)
router.route("/get-order-details/:identifier").get(getOrderDetails)
router.route("/mfv-order").get(gettingBillDetailsForMFVUser)
router.route("/mfv-orders").get(gettingBillDetailsForMFVUserByDate)
router.route("/get-orders").get(verifyJWT, getUserOrderDetails)


module.exports = router