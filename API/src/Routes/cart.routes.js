const { Router } = require("express")
const { verifyJWT } = require("../Middleware/auth.middleware.js")
const {
    addProductToCart,
    getCartProducts,
    removeCartProduct,
    updateCartProduct
} = require("../Controllers/Cart/cart.controller")

const router = Router()

// cart routes
router.route('/add-cart-item').post(verifyJWT, addProductToCart)
router.route('/get-cart-item').get(verifyJWT, getCartProducts)
router.route('/update-cart-item/:itemId').patch(verifyJWT, updateCartProduct)
router.route('/remove-cart-item/:itemId').delete(verifyJWT, removeCartProduct)

module.exports = router