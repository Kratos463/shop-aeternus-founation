const Address = require("../../Models/address.model");
const Cart = require("../../Models/cart.model");
const Order = require("../../Models/order.model");
const Payment = require("../../Models/payment.model");
const Voucher = require("../../Models/voucher.model");
const User = require("../../Models/user.model");
const mongoose = require("mongoose");
const { asyncHandler } = require("../../utils/asyncHandler");
const { ApiError } = require("../../utils/apiError");
const { ObjectId } = require('mongoose').Types;

const generateOrderID = () => {
    const prefix = "SAO";
    const uniqueID = Math.floor(10000000 + Math.random() * 90000000); // Generate 8 random digits
    return `${prefix}${uniqueID}`;
};

// Function to generate unique bill number
const generateBillNo = () => {
    const prefix = "SAB";
    const uniqueID = Math.floor(10000000 + Math.random() * 90000000); // Generate 8 random digits
    return `${prefix}${uniqueID}`;
};

const createOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const { paymentId, voucherId, addressId } = req.body;

        // Check payment status
        const payment = await Payment.findById(paymentId);

        // If payment is not found or status is not successful, return error
        if (!payment || payment.status !== 'Completed') {
            return res.status(400).json({ error: 'Invalid or unsuccessful payment', success: false });
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
            return res.status(400).json({ error: 'Cart Not Found', success: false });
        }

        // Retrieve the shipping address using the provided addressId
        const userAddress = await Address.findOne({ userId, 'address._id': addressId });

        // Check if the address exists and belongs to the user
        if (!userAddress) {
            return res.status(400).json({ error: 'Invalid shipping address', success: false });
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
            shippingAddress: shippingAddress._id,
            orderId: generateOrderID(),
            billNo: generateBillNo(),
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

        res.status(201).json({ success: true, message: "Order successfully placed and cart emptied", _id: order._id });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal server error', success: false });
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

        if (!userVoucherDoc) {
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
        const userId = req.user._id;

        const orders = await Order.aggregate([
            {
                $match: { user: userId }
            },
            {
                $lookup: {
                    from: "payments",
                    localField: "payment",
                    foreignField: "_id",
                    as: "paymentDetails"
                }
            },
            {
                $lookup: {
                    from: "addresses",
                    let: { shippingAddressId: "$shippingAddress" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$userId", userId] },
                                        { $in: ["$$shippingAddressId", "$address._id"] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "shippingAddressDetails"
                }
            },
            {
                $unwind: { path: "$paymentDetails", preserveNullAndEmptyArrays: true }
            },
            {
                $unwind: { path: "$shippingAddressDetails", preserveNullAndEmptyArrays: true }
            },
            {
                $addFields: {
                    shippingAddressDetails: {
                        $arrayElemAt: ["$shippingAddressDetails.address", 0]
                    }
                }
            },
            {
                $lookup: {
                    from: "vouchers",
                    let: { voucherId: "$voucher" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$userId", userId] },
                                        { $in: ["$$voucherId", "$vouchers._id"] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "voucherDetails"
                }
            },
            {
                $unwind: { path: "$voucherDetails", preserveNullAndEmptyArrays: true }
            },
            {
                $addFields: {
                    voucherDetails: {
                        $arrayElemAt: ["$voucherDetails.vouchers", 0]
                    }
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
                    paymentDetails: 1,
                    shippingAddressDetails: 1,
                    voucherDetails: 1,
                    billNo: 1,
                    orderId: 1
                }
            }
        ]);

        if (!orders.length) {
            return res.status(404).json({ message: 'No orders found for this user.' });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

const getUserOrderDetailsByOrderId = async (req, res) => {
    try {
        const { orderId } = req.params; // Get orderId from request params
        const orderObjectId = new ObjectId(orderId);

        // Find the order by orderId
        const order = await Order.findById(orderObjectId).exec();

        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        const userId = order.user.toString();
        const orderDetails = await Order.aggregate([
            {
                $match: { _id: orderObjectId } // Match order by orderId
            },
            {
                $lookup: {
                    from: "payments",
                    localField: "payment",
                    foreignField: "_id",
                    as: "paymentDetails"
                }
            },
            {
                $unwind: { path: "$paymentDetails", preserveNullAndEmptyArrays: true }
            },
            {
                $lookup: {
                    from: "addresses",
                    let: { shippingAddressId: "$shippingAddress" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$userId", new ObjectId(userId)] },
                                        { $in: ["$$shippingAddressId", "$address._id"] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "shippingAddressDetails"
                }
            },
            {
                $unwind: { path: "$shippingAddressDetails", preserveNullAndEmptyArrays: true }
            },
            {
                $addFields: {
                    shippingAddressDetails: {
                        $arrayElemAt: ["$shippingAddressDetails.address", 0]
                    }
                }
            },
            
            {
                $lookup: {
                    from: "vouchers",
                    let: { voucherId: "$voucher" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$userId", new ObjectId(userId)] },
                                        { $in: ["$$voucherId", "$vouchers._id"] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "voucherDetails"
                }
            },
            {
                $unwind: { path: "$voucherDetails", preserveNullAndEmptyArrays: true }
            },
            {
                $addFields: {
                    voucherDetails: {
                        $arrayElemAt: ["$voucherDetails.vouchers", 0]
                    }
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
                    paymentDetails: 1,
                    shippingAddressDetails: 1,
                    voucherDetails: 1,
                    billNo: 1,
                    orderId: 1 // Include orderId in the project stage
                }
            }
        ]);

        if (!orderDetails.length) {
            return res.status(404).json({ message: 'Order details not found.' });
        }

        res.status(200).json(orderDetails[0]); // Return the first (and only) order detail
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

const getAllOrdersWithDetails = async (req, res) => {
    try {
        const orders = await Order.aggregate([
            {
                $lookup: {
                    from: "payments",
                    localField: "payment",
                    foreignField: "_id",
                    as: "paymentDetails"
                }
            },
            {
                $lookup: {
                    from: "addresses",
                    let: { shippingAddressId: "$shippingAddress", userId: "$user" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$userId", "$$userId"] },
                                        { $eq: ["$_id", "$$shippingAddressId"] }
                                    ]
                                }
                            }
                        },
                        {
                            $project: { _id: 0 } // Exclude _id from shippingAddressDetails
                        }
                    ],
                    as: "shippingAddressDetails"
                }
            },
            {
                $lookup: {
                    from: "vouchers",
                    localField: "voucher",
                    foreignField: "_id",
                    as: "voucherDetails"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "userDetails"
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
                    voucherDetails: { $arrayElemAt: ["$voucherDetails", 0] },
                    userDetails: { $arrayElemAt: ["$userDetails", 0] },
                    billNo: 1,
                    orderId: 1 // Include orderId in the project stage
                }
            }
        ]);

        if (!orders.length) {
            return res.status(404).json({ message: 'No orders found.' });
        }

        res.status(200).json(orders); // Return the orders
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

const deleteOrderByID = async (req, res) => {
    try {
        const orderId = req.params.id;

        // Perform deletion in your database
        const deletedOrder = await Order.findByIdAndDelete(orderId);

        if (!deletedOrder) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }

        res.status(200).json({ success: true, message: 'Order deleted successfully.' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ success: false, message: 'Failed to delete order.' });
    }
};

module.exports = {
    getUserOrderDetailsByOrderId,
    getUserOrderDetails,
    createOrder,
    getOrderDetails,
    gettingBillDetailsForMFVUser,
    gettingBillDetailsForMFVUserByDate,
    getAllOrdersWithDetails,
    deleteOrderByID
};
