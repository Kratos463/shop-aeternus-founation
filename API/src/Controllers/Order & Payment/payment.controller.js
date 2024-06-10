const Payment = require("../../Models/payment.model");
const Wallet = require("../../Models/wallet.model");
const WalletTransaction = require("../../Models/walletTransaction");

const createPayment = async (req, res) => {
    try {
        const { amount, method, transactionId } = req.body;

        if (method !== 'Wallet' && (!transactionId || !amount)) {
            return res.status(400).json({ error: 'Transaction ID and amount are required for non-Wallet payments' });
        }

        if (method === 'Wallet') {
            // Fetch the wallet
            const wallet = await Wallet.findOne({ user: req.user._id });

            if (!wallet) {
                return res.status(400).json({ error: 'Wallet not found' });
            }

            if (wallet.amount < amount) {
                return res.status(400).json({ error: 'Insufficient wallet balance' });
            }

            // Reduce the wallet balance
            wallet.amount -= amount;
            await wallet.save();

            // Create a wallet transaction history record
            const walletTransaction = new WalletTransaction({
                user: req.user._id,
                amount,
                type: 'withdrawal'
            });
            await walletTransaction.save();

            // Create a payment record with the wallet transaction ID as transactionId
            const payment = new Payment({
                user: req.user._id,
                amount,
                method,
                transactionId: walletTransaction._id.toString(),
                status: 'Completed'
            });
            await payment.save();

            return res.status(201).json({ success: true, payment });
        }

        // Create a payment record for non-Wallet methods
        const payment = new Payment({
            user: req.user._id,
            amount,
            method,
            transactionId,
            status: 'Completed'
        });
        await payment.save();

        res.status(201).json({ success: true, payment });
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const refundPayment = async (req, res) => {
    try {
        const { paymentId } = req.body; 

        // Find the payment by ID
        const payment = await Payment.findById(paymentId);

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        if (payment.method !== 'Wallet') {
            return res.status(400).json({ error: 'Refund is only supported for Wallet payments' });
        }

        // Fetch the wallet
        const wallet = await Wallet.findOne({ user: payment.user });

        if (!wallet) {
            return res.status(400).json({ error: 'Wallet not found' });
        }

        // Increase the wallet balance
        wallet.amount += payment.amount;
        await wallet.save();

        // Create a wallet transaction history record for the refund
        const walletTransaction = new WalletTransaction({
            user: payment.user,
            amount: payment.amount,
            type: 'refund'
        });
        await walletTransaction.save();

        // Update the payment status to 'Refunded'
        payment.status = 'Refunded';
        await payment.save();

        return res.status(200).json({ success: true, message: 'Payment refunded successfully' });
    } catch (error) {
        console.error('Error refunding payment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { createPayment, refundPayment };

