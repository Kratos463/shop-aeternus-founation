const Address = require("../../Models/address.model");
const Cart = require("../../Models/cart.model");
const Order = require("../../Models/order.model");
const Payment = require("../../Models/payment.model");
const Voucher = require("../../Models/voucher.model");
const mongoose = require("mongoose")

const createOrder = async (req, res) => {
    try {
        const { paymentId, voucherCode, addressId } = req.body;
        const userId = req.user._id;

        // Check payment status
        const payment = await Payment.findById(paymentId);

        // If payment is not found or status is not successful, return error
        if (!payment || payment.status !== 'Completed') {
            return res.status(400).json({ error: 'Invalid or unsuccessful payment' });
        }

        // Search for the voucher in the database
        const voucher = await Voucher.findOne({ 'vouchers.code': voucherCode, 'vouchers.isUsed': false, 'vouchers.expiresAt': { $gte: new Date() } });

        // If voucher not found or expired, return error
        if (!voucher) {
            return res.status(400).json({ error: 'Invalid or expired voucher code' });
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

        // Create the order including cart items and valid shipping address
        const order = new Order({
            user: userId,
            items: cart.items,
            payment: paymentId,
            shippingAddress: shippingAddress._id, // Set the shipping address ID
            billNo: new mongoose.Types.ObjectId().toString(),
            totalPayAmount: payment.amount,
            totalAmount: cart.total,
            totalBV: cart.totalBV,
            voucher: voucher._id,
            status: 'Pending'
        });

        // Save the order to the database
        await order.save();

        // Mark the voucher as used
        voucher.vouchers[0].isUsed = true;
        await voucher.save();

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


module.exports = { createOrder, getOrderDetails };
