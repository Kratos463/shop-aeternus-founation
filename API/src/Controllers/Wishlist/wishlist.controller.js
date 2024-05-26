const { asyncHandler } = require('../../utils/asyncHandler.js')
const { ApiError } = require('../../utils/apiError.js')
const { ApiResponse } = require('../../utils/apiResponse.js');
const Wishlist= require('../../Models/wishlist.model.js');


const addItemToWishlist = asyncHandler(async (req, res)=> {
    const {productId, skuId, title, description, price, image, sizeId, colorId } = req.body;

        // Check if all required fields are provided
        if (![productId, skuId, title, price, sizeId, colorId, image].every(field => typeof field === 'string' && field.trim() !== '')) {
            throw new ApiError(400, "Please provide all the required fields and ensure quantity is a positive number")
        }

        // Find the wishlist for the given user
        let wishlist = await Wishlist.findOne({ userId: req.user._id });

        // If the wishlist doesn't exist, create a new one
        if (!wishlist) {
            wishlist = new Wishlist({
                userId: req.user._id,
                items: []
            });
        }

        // Check if the item already exists in the wishlist
        const existingItemIndex = wishlist.items.findIndex(item => item.productId === productId && item.skuId === skuId);

        if (existingItemIndex !== -1) {
            // If the item already exists, update its details
            wishlist.items[existingItemIndex] = {
                ...wishlist.items[existingItemIndex],
                title,
                description,
                price,
                image,
                sizeId,
                colorId,
            };
            await wishlist.save();
            return res.status(200).json(new ApiResponse(200, {}, "Item updated in wishlist successfully"))
        } else {
            // If the item doesn't exist, add it to the wishlist
            wishlist.items.push({
                productId,
                skuId,
                title,
                description,
                price,
                image,
                sizeId,
                colorId,
            });
        }

        // Save the wishlist to the database
        await wishlist.save();

        // Return success response
        return res.status(200).json(new ApiResponse(200, {}, "Item added in wishlist successfully"))
})


const getWishlistProducts = asyncHandler(async (req, res) => {

    const wishlist = await Wishlist.findOne({ userId: req.user._id });

    if (!wishlist) {
        return new ApiError(400, "Cart not found")
    }

    return res.status(200).json(new ApiResponse(200, wishlist, "Wishlist Successfully fetched"));
})

const removeWishlistProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    // Check if productId is provided
    if (!productId) {
        throw new ApiError(400, "Please provide productId.");
    }

    // Find the user's wishlist in the database
    const wishlist = await Wishlist.findOne({ userId: req.user._id });

    if (!wishlist) {
        return res.status(404).json(new ApiResponse(404, "Wishlist not found"));
    }

    // Filter out the item to remove from the wishlist
    const initialLength = wishlist.items.length;
    wishlist.items = wishlist.items.filter(item => item.productId !== productId);

    if (wishlist.items.length === initialLength) {
        // If the length hasn't changed, the item wasn't found
        return res.status(404).json(new ApiResponse(404, "Item not found in wishlist"));
    }

    // Save the updated wishlist to the database
    await wishlist.save();

    return res.status(200).json(new ApiResponse(200, "Item removed from wishlist"));
});


module.exports = {
    addItemToWishlist,
    getWishlistProducts,
    removeWishlistProduct
}