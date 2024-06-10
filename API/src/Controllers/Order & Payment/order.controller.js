const Address = require("../../Models/address.model");
const Cart = require("../../Models/cart.model");
const Order = require("../../Models/order.model");
const Payment = require("../../Models/payment.model");
const Voucher = require("../../Models/voucher.model");
const User = require("../../Models/user.model");
const mongoose = require("mongoose");
const { asyncHandler } = require("../../utils/asyncHandler");
const { ApiError } = require("../../utils/apiError");

const createOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const { paymentId, voucherId, addressId } = req.body;

        // Check payment status
        const payment = await Payment.findById(paymentId);

        // If payment is not found or status is not successful, return error
        if (!payment || payment.status !== 'Completed') {
            return res.status(400).json({ error: 'Invalid or unsuccessful payment' });
        }

        // Find vouchers associated with the user's _id
        const voucherDocs = await Voucher.find({ userId });

        // Search for the specific voucher within the voucher documents
        let voucher = null;
        if (voucherId) {
            voucher = voucherDocs.find(voucherDoc => voucherDoc.vouchers.some(voucherObj => voucherObj._id.toString() === voucherId && !voucherObj.isUsed && voucherObj.expiresAt >= new Date()));
        }

        // Retrieve items from the user's cart
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(400).json({ error: 'Cart Not Found' });
        }

        // Retrieve the shipping address using the provided addressId
        const userAddress = await Address.findOne({ userId, 'address._id': addressId });

        // Check if the address exists and belongs to the user
        if (!userAddress) {
            return res.status(400).json({ error: 'Invalid shipping address' });
        }

        // Extract the specific address from the address array using addressId
        const shippingAddress = userAddress.address.find(address => address._id.toString() === addressId);

        // Calculate totalBV based on whether a voucher is provided
        let totalBV = cart.totalBV;
        if (voucherId) {
            totalBV = 0;
        }

        // Create the order including cart items and valid shipping address
        const order = new Order({
            user: userId,
            items: cart.items,
            payment: paymentId,
            shippingAddress: shippingAddress._id, // Set the shipping address ID
            billNo: new mongoose.Types.ObjectId().toString(),
            totalPayAmount: payment.amount,
            totalAmount: cart.total,
            totalBV: totalBV,
            voucher: voucherId || null,
            status: 'Pending'
        });

        // Save the order to the database
        await order.save();

        // If a voucher is used, mark it as used
        if (voucherId && voucher) {
            const voucherObj = voucher.vouchers.find(voucherObj => voucherObj._id.toString() === voucherId);
            voucherObj.isUsed = true;
            await voucher.save();
        }

        // Empty the user's cart
        await Cart.findOneAndUpdate(
            { userId },
            { 
                $set: { 
                    items: [],
                    total: 0,
                    totalBV: 0,
                    itemsQuantity: 0
                } 
            }
        );

        res.status(201).json({ success: true, message: "Order successfully placed and cart emptied" });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const getOrderDetails = async (req, res) => {
    try {
        const identifier = req.params.identifier;

        // Check if the identifier is a valid ObjectId
        let matchCondition;
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            matchCondition = { _id: new mongoose.Types.ObjectId(identifier) };
        } else {
            matchCondition = { billNo: identifier };
        }

        const orderDetails = await Order.aggregate([
            { $match: matchCondition },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $lookup: {
                    from: 'payments',
                    localField: 'payment',
                    foreignField: '_id',
                    as: 'paymentDetails'
                }
            },
            {
                $lookup: {
                    from: 'vouchers',
                    localField: 'voucher',
                    foreignField: '_id',
                    as: 'voucherDetails'
                }
            },
            { 
                $addFields: {
                    shippingAddressId: { $toObjectId: '$shippingAddress' } // Convert shippingAddress to ObjectId
                }
            },
            {
                $lookup: {
                    from: 'addresses',
                    localField: 'shippingAddressId',
                    foreignField: '_id',
                    as: 'shippingAddressDetails'
                }
            },
            { $unwind: { path: '$voucherDetails', preserveNullAndEmptyArrays: true } }, // Preserve if voucher is not used
            { $unwind: { path: '$shippingAddressDetails', preserveNullAndEmptyArrays: true } } // Preserve if shipping address is not available
        ]);

        if (!orderDetails.length) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Extract specific fields from userDetails and paymentDetails
        const userDetails = orderDetails[0].userDetails[0];
        const paymentDetails = orderDetails[0].paymentDetails[0];
        
        // Extract specific fields from voucherDetails
        const voucherDetails = orderDetails[0].voucherDetails ? {
            _id: orderDetails[0].voucherDetails._id,
            currentUsed: orderDetails[0].voucherDetails.currentUsed,
            code: orderDetails[0].voucherDetails.code,
            cost: orderDetails[0].voucherDetails.cost
        } : null;

        res.status(200).json({ success: true, orderDetails: { userDetails, paymentDetails, voucherDetails, shippingAddressDetails: orderDetails[0].shippingAddressDetails } });
    } catch (error) {
        console.error('Error getting order details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const gettingBillDetailsForMFVUser = asyncHandler(async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            throw new ApiError(400, "Please provide the email");
        }

        const user = await User.findOne({ email });

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        if (!user.mfvUser) {
            throw new ApiError(400, "User is not an mfvUser");
        }

        // Find the user's voucher document
        const userVoucherDoc = await Voucher.findOne({ userId: user._id });

        if(!userVoucherDoc){
            throw new ApiError(400, "No voucher found")
        }

        // Retrieve the orders for the user
        const orders = await Order.find({ user: user._id });

        // Extract specific fields from each order and include voucher code if available
        const billDetails = orders.map(order => {
            let voucherCode = null;
            if (order.voucher && userVoucherDoc) {
                const matchingVoucher = userVoucherDoc.vouchers.find(voucher => voucher._id.toString() === order.voucher.toString());
                if (matchingVoucher) {
                    voucherCode = matchingVoucher.code;
                }
            }

            return {
                orderId: order._id,
                totalPayAmount: order.totalPayAmount,
                totalBV: order.totalBV,
                billNo: order.billNo,
                billDate: order.createdAt,
                voucherCode: voucherCode
            };
        });

        // Send the response with the bill details
        res.status(200).json({
            success: true,
            data: billDetails,
            message: "Bill Details successfully fetched"
        });

    } catch (error) {
        // Handle the error and send an appropriate response
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
});

const gettingBillDetailsForMFVUserByDate = asyncHandler(async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            throw new ApiError(400, "Please provide both startDate and endDate");
        }

        // Convert dates to ISO format for comparison
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new ApiError(400, "Invalid date format. Please use YYYY-MM-DD.");
        }

        // Retrieve MFV users within the date range
        const users = await User.find({ mfvUser: true });

        const userIds = users.map(user => user._id);

        // Retrieve orders for MFV users within the date range
        const orders = await Order.find({
            user: { $in: userIds },
            createdAt: { $gte: start, $lte: end }
        });

        if (orders.length === 0) {
            throw new ApiError(404, "No orders found within the specified date range");
        }

        // Find voucher documents for MFV users
        const voucherDocs = await Voucher.find({ userId: { $in: userIds } });

        // Extract specific fields from each order and include voucher code if available
        const billDetails = orders.map(order => {
            const userVoucherDoc = voucherDocs.find(doc => doc.userId.toString() === order.user.toString());
            let voucherCode = null;
            if (order.voucher && userVoucherDoc) {
                const matchingVoucher = userVoucherDoc.vouchers.find(voucher => voucher._id.toString() === order.voucher.toString());
                if (matchingVoucher) {
                    voucherCode = matchingVoucher.code;
                }
            }

            return {
                orderId: order._id,
                totalPayAmount: order.totalPayAmount,
                totalBV: order.totalBV,
                billNo: order.billNo,
                billDate: order.createdAt,
                voucherCode: voucherCode
            };
        });

        // Send the response with the bill details
        res.status(200).json({
            success: true,
            data: billDetails,
            message: "Bill Details successfully fetched"
        });

    } catch (error) {
        // Handle the error and send an appropriate response
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
});

const getUserOrderDetails = async (req, res) => {
    try {
        // Assuming req.user._id contains the authenticated user's ID
        const userId = req.user._id;

        // Use aggregation to fetch orders with populated fields
        const orders = await Order.aggregate([
            {
                $match: { user: userId }
            },
            {
                $lookup: {
                    from: "payments", // Assuming the name of the payments collection
                    localField: "payment",
                    foreignField: "_id",
                    as: "paymentDetails"
                }
            },
            {
                $lookup: {
                    from: "addresses", // Assuming the name of the addresses collection
                    let: { shippingAddressId: "$shippingAddress" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$userId", userId] },
                                        { $in: ["$$shippingAddressId", ["$_id"]] }
                                    ]
                                }
                            }
                        },
                        { $unwind: "$address" },
                        {
                            $match: {
                                $expr: { $eq: ["$address._id", "$$shippingAddressId"] }
                            }
                        }
                    ],
                    as: "shippingAddressDetails"
                }
            },
            {
                $unwind: { path: "$voucher", preserveNullAndEmptyArrays: true } // Unwind the voucher array
            },
            {
                $lookup: {
                    from: "vouchers", // Assuming the name of the vouchers collection
                    localField: "voucher",
                    foreignField: "_id",
                    as: "voucherDetails"
                }
            },
            {
                $project: {
                    _id: 1,
                    items: 1,
                    totalAmount: 1,
                    totalPayAmount: 1,
                    totalBV: 1,
                    status: 1,
                    createdAt: 1,
                    paymentDetails: { $arrayElemAt: ["$paymentDetails", 0] },
                    shippingAddressDetails: { $arrayElemAt: ["$shippingAddressDetails", 0] },
                    voucherDetails: { $arrayElemAt: ["$voucherDetails", 0] }
                }
            }
        ]);

        // If no orders found, return a 404 status
        if (!orders.length) {
            return res.status(404).json({ message: 'No orders found for this user.' });
        }

        // Respond with the orders
        res.status(200).json(orders);
    } catch (error) {
        // Log the error and respond with a 500 status for server errors
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};


module.exports = { getUserOrderDetails, createOrder, getOrderDetails, gettingBillDetailsForMFVUser, gettingBillDetailsForMFVUserByDate };
