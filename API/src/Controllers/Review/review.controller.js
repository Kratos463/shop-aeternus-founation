const { asyncHandler } = require('../../utils/asyncHandler.js')
const { ApiError } = require('../../utils/apiError.js')
const { ApiResponse } = require('../../utils/apiResponse.js');
const Review = require('../../Models/review.model');

const addReview = asyncHandler(async (req, res) => {
    const { productId, reviewText, rating } = req.body;
    const userId = req.user._id;

    // Check if the user has already reviewed this product
    const existingReview = await Review.findOne({ productId, userId });

    if (existingReview) {
        throw new ApiError(400, 'You have already reviewed this product');
    }

    // Create a new review
    const newReview = new Review({
        productId,
        userId,
        reviewText,
        rating,
    });

    // Save the review to the database
    await newReview.save();

    res.status(201).json(new ApiResponse(201, newReview, 'Review added successfully'));
});

const getReviewsByProduct = asyncHandler(async (req, res) => {
    const productId = req.params.productId;

    // Fetch reviews and populate the user field with the username
    const reviews = await Review.find({ productId }).populate('userId', 'username');

    if (!reviews || reviews.length === 0) {
        return new ApiError(404, 'No reviews found for this product');
    }

    res.status(200).json(new ApiResponse(200, reviews, 'Reviews fetched successfully'));
});


const deleteReviewByUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { reviewId } = req.params;

    // Find the review to be deleted by its ID and user ID
    const reviewToDelete = await Review.findOneAndDelete({ _id: reviewId, userId });

    if (!reviewToDelete) {
        throw new ApiError(404, 'Review not found or you are not authorized to delete this review');
    }

    res.status(200).json(new ApiResponse(200, {}, 'Review deleted successfully'));
});


module.exports = { addReview, getReviewsByProduct, deleteReviewByUser }