const { Router } = require("express")
const { verifyJWT } = require("../Middleware/auth.middleware.js")
const {
    addItemToWishlist,
    getWishlistProducts,
    removeWishlistProduct
} = require("../Controllers/Wishlist/wishlist.controller")


const router = Router()

// cart routes
router.route('/add-wishlist-item').post(verifyJWT, addItemToWishlist)
router.route('/get-wishlist-item').get(verifyJWT, getWishlistProducts)
router.route('/remove-wishlist-item/:productId').delete(verifyJWT, removeWishlistProduct)

module.exports = router