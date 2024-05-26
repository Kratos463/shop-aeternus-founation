const { Router } = require("express")
const { verifyJWT } = require("../Middleware/auth.middleware.js")
const { addReview, getReviewsByProduct, deleteReviewByUser } = require("../Controllers/Review/review.controller.js")

const router = Router()

router.route("/write-review").post(verifyJWT, addReview)
router.route("/get-reviews/:productId").get(getReviewsByProduct)
router.route("/remove-review/:reviewId").delete(verifyJWT, deleteReviewByUser)

module.exports = router