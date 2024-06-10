const { Router } = require("express")
const { verifyAdminJWT } = require("../Middleware/admin.middleware.js")
const { createDiscount, getDiscounts, getDiscountById, updateDiscount, deleteDiscount, getDiscountByProductPrice } = require("../Controllers/Discount/discount.controller.js")

const router = Router()

// basic admin routes
router.route("/").post(verifyAdminJWT, createDiscount)
router.route("/").get(getDiscounts)
router.route("/:id").get(getDiscountById)
router.route("/:id").patch(verifyAdminJWT, updateDiscount)
router.route("/:id").delete(verifyAdminJWT, deleteDiscount)
router.route("/get-discount/:price").get(getDiscountByProductPrice)

module.exports = router