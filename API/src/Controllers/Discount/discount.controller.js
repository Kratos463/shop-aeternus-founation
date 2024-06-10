const Discount = require("../../Models/discount.model");
const {ApiError} = require("../../utils/apiError");
const { asyncHandler } = require("../../utils/asyncHandler");

// Create a new discount
const createDiscount = asyncHandler(async (req, res) => {
    try {
        const {startingPrice, endingPrice, discountPercentage} = req.body

        if(!startingPrice || !endingPrice || !discountPercentage){
            throw new ApiError(400, "Please provide all required fields")
        }

        const discount = new Discount({
            startingPrice,
            endingPrice,
            discountPercentage
        })

        await discount.save()

        return res.status(201).json({message: "Discount created successfully", success: true})

    } catch (error) {
        throw new ApiError(400, error.message);
    }
});

// Get all discounts
const getDiscounts = async (req, res, next) => {
    try {
        const discounts = await Discount.find();
        res.status(200).send(discounts);
    } catch (error) {
        throw new ApiError(500, error.message);
    }
};

// Get a discount by ID
const getDiscountById = async (req, res, next) => {
    try {
        const discount = await Discount.findById(req.params.id);
        if (!discount) {
            throw new ApiError(404, 'Discount not found');
        }
        res.status(200).send(discount);
    } catch (error) {
        throw new ApiError(500, error.message);
    }
};

// Update a discount by ID
const updateDiscount = async (req, res, next) => {
    try {
        const discount = await Discount.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!discount) {
            throw new ApiError(404, 'Discount not found');
        }
        res.status(200).send(discount);
    } catch (error) {
        throw new ApiError(400, error.message);
    }
};

// Delete a discount by ID
const deleteDiscount = async (req, res, next) => {
    try {
        const discount = await Discount.findByIdAndDelete(req.params.id);
        if (!discount) {
            throw new ApiError(404, 'Discount not found');
        }
        res.status(200).send(discount);
    } catch (error) {
        throw new ApiError(500, error.message);
    }
};

const getDiscountByProductPrice = asyncHandler(async (req, res) => {
    try {
        const productPrice = parseInt(req.params.price); // Parse the price string to an integer

        // Find the discount that matches the provided price range
        const discount = await Discount.findOne({
            startingPrice: { $lte: productPrice },
            endingPrice: { $gte: productPrice }
        });

        if (!discount) {
            return res.status(404).json({ error: 'No discount found for the provided price' });
        }

        // Return the discount information
        res.status(200).json({ discount });
    } catch (error) {
        console.error("Error:", error);
        return res.status(400).json({ error: error.message });
    }
});




module.exports = {
    createDiscount,
    getDiscounts,
    getDiscountById,
    updateDiscount,
    deleteDiscount,
    getDiscountByProductPrice
};
