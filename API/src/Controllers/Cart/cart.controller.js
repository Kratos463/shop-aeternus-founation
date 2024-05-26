const { asyncHandler } = require('../../utils/asyncHandler.js')
const { ApiError } = require('../../utils/apiError.js')
const { ApiResponse } = require('../../utils/apiResponse.js');
const Cart = require('../../Models/cart.model.js');



const addProductToCart = asyncHandler(async (req, res) => {
    const { productId, skuId, title, description, price, image, sizeId, colorId, quantity } = req.body;

    // Validate required fields
    if (
        ![productId, skuId, title, price, sizeId, colorId, image].every(field => typeof field === 'string' && field.trim() !== '') ||
        typeof quantity !== 'number' || quantity <= 0
    ) {
        throw new ApiError(400, "Please provide all the required fields and ensure quantity is a positive number");
    }

    // Check if the cart exists for the user
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
        // If the cart doesn't exist, create a new cart entry
        cart = new Cart({
            userId: req.user._id,
            items: []
        });
    }

    // Check if the item already exists in the cart
    const existingItemIndex = cart.items.findIndex(item => item.productId === productId && item.skuId === skuId);

    if (existingItemIndex !== -1) {
        // If the item exists, update its quantity
        cart.items[existingItemIndex].quantity += quantity;
    } else {
        // If the item doesn't exist, add it to the cart
        cart.items.push({
            productId,
            skuId,
            title,
            description,
            price,
            image,
            sizeId,
            colorId,
            quantity
        });
    }

    // Update total price and items quantity
    cart.total = cart.items.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
    cart.itemsQuantity = cart.items.reduce((total, item) => total + item.quantity, 0);

    // Save the cart to the database
    await cart.save();

    // Return success response
    return res.status(201).json(new ApiResponse(200, {}, "Item added to cart."));
});

const getCartProducts = asyncHandler(async (req, res) => {

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
        return new ApiError(400, "Cart not found")
    }

    return res.status(200).json(new ApiResponse(200, cart, "Cart Successfully fetched"));
})

const removeCartProduct = asyncHandler(async (req, res) => {
    const { itemId } = req.params;

    // Check if itemId is provided
    if (!itemId) {
        throw new ApiError(400, "Please provide itemId.");
    }

    // Find the user's cart in the database
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
        throw new ApiError(400, "Cart not found for the user");
    }

    // Find the index of the item in the cart
    const itemIndex = cart.items.findIndex(item => item.productId === itemId);

    if (itemIndex === -1) {
        throw new ApiError(400, "Item not found in the cart");
    }

    // Remove the item from the cart
    cart.items.splice(itemIndex, 1);

    // Update total price and items quantity
    cart.total = cart.items.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
    cart.itemsQuantity = cart.items.reduce((total, item) => total + item.quantity, 0);

    // Save the updated cart to the database
    await cart.save();

    // Return success response
    return res.status(200).json(new ApiResponse(200, "Item removed from cart"));
});

const updateCartProduct = asyncHandler(async (req, res)=> {
    const { itemId} = req.params;
    const {quantity} = req.body

    // Check if all required fields are provided
    if (!itemId || typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).json({ error: "Please provide product id and ensure quantity is a positive number" });
    }

    // Find the user's cart in the database
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
        throw new ApiError(400, "Cart not found for the user");
    }

    // Find the index of the item in the cart
    const itemIndex = cart.items.findIndex(item => item.productId === itemId);

    if (itemIndex === -1) {
        throw new ApiError(400, "Item not found in the cart");
    }

    // Update the quantity of the item in the cart
    cart.items[itemIndex].quantity = quantity;

    // Update total price and items quantity
    cart.total = cart.items.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
    cart.itemsQuantity = cart.items.reduce((total, item) => total + item.quantity, 0);

    // Save the updated cart to the database
    await cart.save();

    // Return success response
    return res.status(200).json(new ApiResponse(200, "Quanity updated in cart"));
})

module.exports = {
    addProductToCart,
    getCartProducts,
    removeCartProduct,
    updateCartProduct
}
