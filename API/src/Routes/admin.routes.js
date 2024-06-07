const { Router } = require("express")
const { registerAdmin, loginAdmin, logoutAdmin } = require("../Controllers/Admin/admin.controller.js")
const { verifyAdminJWT } = require("../Middleware/admin.middleware.js")

const router = Router()

// basic admin routes
router.route("/register-admin").post(registerAdmin)
router.route("/login-admin").post(loginAdmin)
router.route("/logout-admin").post(verifyAdminJWT, logoutAdmin)

module.exports = router