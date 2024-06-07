const { Router } = require("express")
const { verifyJWT } = require("../Middleware/auth.middleware.js")
const { createOrder, getOrderDetails } = require("../Controllers/Order & Payment/order.controller.js")

const router = Router()


router.route("/make-order").post(verifyJWT, createOrder)
router.route("/get-order-details/:identifier").get(getOrderDetails)


module.exports = router