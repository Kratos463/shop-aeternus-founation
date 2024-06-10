const { asyncHandler } = require('../../utils/asyncHandler.js')
const { ApiError } = require('../../utils/apiError.js')
const { ApiResponse } = require('../../utils/apiResponse.js');
const Cart = require('../../Models/cart.model.js');


const addProductToCart = asyncHandler(async (req, res) => {
    const {
        productId,
        categoryId,
        productCode,
        title,
        skuId,
        stockQty,
        gstPerFirst,
        gstPerSecond,
        hsnCode,
        image,
        sizeId,
        colorId,
        regularPriceSelf,
        priceSelf,
        pointsAdjustedSelf,
        shippingChargesSelf,
        bvSelf,
        saveUptoSelf,
        regularPrice,
        pointsAdjusted,
        shippingCharges,
        saveUpto,
        productUrl,
        quantity,
        price,
        offerPrice,
        discountPercentage
    } = req.body;

    // Validate required fields
    if (
        ![productId, skuId, title, image].every(field => typeof field === 'string' && field.trim() !== '') ||
        typeof quantity !== 'number' || quantity <= 0 ||
        typeof offerPrice !== 'number' || offerPrice <= 0
    ) {
        throw new ApiError(400, "Please provide all the required fields and ensure quantity and prices are positive numbers");
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
        const existingItem = cart.items[existingItemIndex];
        existingItem.quantity += quantity;
        existingItem.bv = (parseFloat(existingItem.bvSelf) * existingItem.quantity).toFixed(2);
    } else {
        // If the item doesn't exist, add it to the cart
        cart.items.push({
            productId,
            categoryId: categoryId || '',
            productCode: productCode || '',
            title,
            skuId,
            stockQty: stockQty || '',
            mediumFile: image,
            sizeId: sizeId || '',
            colorId: colorId || '',
            gstPerFirst: gstPerFirst || '',
            gstPerSecond: gstPerSecond || '',
            hsnCode: hsnCode || '',
            regularPriceSelf: regularPriceSelf || '',
            priceSelf: priceSelf || '',
            pointsAdjustedSelf: pointsAdjustedSelf || '',
            shippingChargesSelf: shippingChargesSelf || '',
            bvSelf: bvSelf || '',
            saveUptoSelf: saveUptoSelf || '',
            regularPrice: regularPrice || '',
            pointsAdjusted: pointsAdjusted || '',
            shippingCharges: shippingCharges || '',
            bv: (parseFloat(bvSelf) * quantity).toFixed(2),
            saveUpto: saveUpto || '',
            productUrl: productUrl || '',
            quantity,
            price,
            offerPrice,
            discountPercentage
        });
    }

    // Update total price, items quantity, and total BV
    cart.total = cart.items.reduce((total, item) => total + item.offerPrice * item.quantity, 0).toFixed(2);
    cart.itemsQuantity = cart.items.reduce((total, item) => total + item.quantity, 0);
    cart.totalBV = cart.items.reduce((total, item) => total + (parseFloat(item.bv) || 0), 0).toFixed(2);

    await cart.save();

    return res.status(201).json(new ApiResponse(200, {}, "Item added to cart."));
});



const getCartProductById = asyncHandler(async (req, res) => {

    const { productId } = req.params;


    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
        return res.status(404).json(new ApiResponse(404, null, "Cart not found"));
    }

    const productInCart = cart.items.some(item => item.productId === productId);


    return res.status(200).json(new ApiResponse(200, { productInCart }, "Product in cart status fetched"));
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

    // Get the BV value of the removed item
    const removedItem = cart.items[itemIndex];
    const removedItemBV = parseFloat(removedItem.bv) || 0;

    // Remove the item from the cart
    cart.items.splice(itemIndex, 1);

    // Update total price, items quantity, and total BV
    cart.total = cart.items.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
    cart.itemsQuantity = cart.items.reduce((total, item) => total + item.quantity, 0);
    cart.totalBV -= removedItemBV; // Subtract the BV value of the removed item from the totalBV

    // Save the updated cart to the database
    await cart.save();

    // Return success response
    return res.status(200).json(new ApiResponse(200, "Item removed from cart"));
});


const updateCartProduct = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;

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

    // Get the current BV self value of the item
    const currentItem = cart.items[itemIndex];
    const bvSelf = parseFloat(currentItem.bvSelf) || 0;

    // Update the quantity of the item in the cart
    cart.items[itemIndex].quantity = quantity;

    // Update the BV of the item in the cart based on the new quantity and BV self value
    cart.items[itemIndex].bv = bvSelf * quantity;

    // Update total price, items quantity, and total BV
    cart.total = cart.items.reduce((total, item) => total + parseFloat(item.offerPrice) * item.quantity, 0);
    cart.itemsQuantity = cart.items.reduce((total, item) => total + item.quantity, 0);
    cart.totalBV = cart.items.reduce((total, item) => total + (parseFloat(item.bv) || 0), 0);

    // Save the updated cart to the database
    await cart.save();

    // Return success response
    return res.status(200).json(new ApiResponse(200, "Quantity updated in cart"));
});


module.exports = {
    getCartProductById,
    addProductToCart,
    getCartProducts,
    removeCartProduct,
    updateCartProduct
}
