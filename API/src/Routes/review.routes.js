const { Router } = require("express")
const { verifyJWT } = require("../Middleware/auth.middleware.js")
const {
    addReview,
    getReviewsByProduct,
    deleteReviewByUser,
    updateReview
} = require("../Controllers/Review/review.controller.js")

const router = Router()


router.route("/write-review").post(verifyJWT, addReview)
router.route("/get-reviews/:productId").get(getReviewsByProduct)
router.route("/remove-review/:reviewId").delete(verifyJWT, deleteReviewByUser)
router.route("/update-review/:reviewId").patch(verifyJWT, updateReview)


module.exports = router