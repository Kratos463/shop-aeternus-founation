const { Router } = require("express")
const { verifyJWT } = require("../Middleware/auth.middleware.js")
const {
    registerUser,
    loginUser,
    logoutUser,
    changeCurrentPassword,
    getCurrentUser,
    updateUserDetails,
    addAddress,
    deleteAddress,
    getAddress,
    updateAddress
} = require("../Controllers/User/user.controller")

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

// secure routes
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route('/change-password').post(verifyJWT, changeCurrentPassword)
router.route('/update-user-profile').patch(verifyJWT, updateUserDetails)

// address routes
router.route('/add-shipping-address').post(verifyJWT, addAddress)
router.route('/get-shipping-address').get(verifyJWT, getAddress)
router.route('/remove-shipping-address/:addressId').delete(verifyJWT, deleteAddress)
router.route('/update-shipping-address').patch(verifyJWT, updateAddress)


module.exports = router