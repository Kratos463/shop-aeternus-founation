const { asyncHandler } = require('../../utils/asyncHandler');
const { ApiError } = require('../../utils/apiError');
const Wallet = require('../../Models/wallet.model');
const User = require('../../Models/user.model');
const WalletTransaction = require('../../Models/walletTransaction');
const mongoose = require("mongoose")

const addAmountToWallet = asyncHandler(async (req, res) => {
    try {
        const { email, amount } = req.body;

        // Validate the email and amount
        if (!email) {
            throw new ApiError(400, "Please provide a valid email");
        }
        if (isNaN(amount) || amount <= 0) {
            throw new ApiError(400, "Please provide a valid amount");
        }

        // Ensure amount is treated as a number
        const numericAmount = Number(amount);

        const user = await User.findOne({ email });

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        let wallet = await Wallet.findOne({ user: user._id });

        if (wallet) {
            wallet.amount += numericAmount;
        } else {
            // Create a new wallet
            wallet = new Wallet({
                user: user._id,
                amount: numericAmount
            });
        }

        // Save the wallet to the database
        await wallet.save();

        // Create a new wallet transaction for the deposit
        const walletTransaction = new WalletTransaction({
            user: user._id,
            amount: numericAmount,
            type: 'deposit',
            transactionId: new mongoose.Types.ObjectId().toString() // Generate a transaction ID
        });

        // Save the wallet transaction to the database
        await walletTransaction.save();

        res.status(200).json({
            success: true,
            data: wallet,
            message: "Wallet successfully created/updated"
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
});



const fetchWallet = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        // Find the user by userId
        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Check if the user is an MFV user
        if (!user.mfvUser) {
            throw new ApiError(400, "User is not an MFV user");
        }

        // Find the wallet associated with the user
        const wallet = await Wallet.findOne({ user: userId });

        if (!wallet) {
            throw new ApiError(404, "Wallet not found");
        }

        // Find wallet transactions for the user
        const transactions = await WalletTransaction.find({ user: userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                amount: wallet.amount,
                transactions: transactions.map(transaction => ({
                    amount: transaction.amount,
                    type: transaction.type,
                    createdAt: transaction.createdAt
                }))
            },
            message: "Wallet information successfully fetched"
        });
    } catch (error) {
        // Handle the error and send an appropriate response
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
});

module.exports = {addAmountToWallet, fetchWallet};
