const Payment = require("../../Models/payment.model");

const createPayment = async (req, res) => {
    try {
        const { amount, method, transactionId} = req.body;

        // Validate the payment method
        if (method !== 'COD' && (!transactionId || !amount)) {
            return res.status(400).json({ error: 'Transaction ID and amount are required for PayPal and crypto payments' });
        }

        // Create a new payment document with initial status
        const payment = new Payment({
            user: req.user._id,
            amount,
            method,
            transactionId,
            status: "Completed"
        });

        // Save the payment document to the database
        await payment.save();

        res.status(201).json({ success: true, payment });
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { createPayment };
