const { Router } = require("express")
const { registerAdmin, loginAdmin, logoutAdmin } = require("../Controllers/Admin/admin.controller.js")
const { verifyAdminJWT } = require("../Middleware/admin.middleware.js")
const { getAllUsers } = require("../Controllers/User/user.controller.js")
const { getAllPayments } = require("../Controllers/Order & Payment/payment.controller.js")
const { getAllOrdersWithDetails } = require("../Controllers/Order & Payment/order.controller.js")

const router = Router()

// basic admin routes
router.route("/register-admin").post(registerAdmin)
router.route("/login-admin").post(loginAdmin)
router.route("/logout-admin").post(verifyAdminJWT, logoutAdmin)

// users
router.route("/getUsers").get(verifyAdminJWT, getAllUsers)

// payment & orders
router.route("/payments").get(verifyAdminJWT, getAllPayments)
router.route("/orders").get(verifyAdminJWT, getAllOrdersWithDetails)

module.exports = router