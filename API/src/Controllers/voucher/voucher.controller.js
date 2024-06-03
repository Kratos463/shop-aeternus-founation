const { asyncHandler } = require("../../utils/asyncHandler");
const { generateVoucherCode } = require("../../../constants");
const User = require("../../Models/user.model");
const Voucher = require("../../Models/voucher.model");


const createVoucher = asyncHandler(async (req, res) => {
    const { email, numOfVouchers } = req.body;

    if (!email || !numOfVouchers) {
        return res.status(400).json({ error: "Email and number of vouchers are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    // Check if vouchers for the provided user already exist
    const existingVoucherEntry = await Voucher.findOne({ userId: user._id });

    if (existingVoucherEntry) {
        return res.status(400).json({ error: "Vouchers for this user already exist" });
    }

    const vouchers = [];
    let attempts = 0;
    while (vouchers.length < numOfVouchers && attempts < 1000) {
        const code = generateVoucherCode();
        
        // Check if the generated code is unique
        const isUnique = vouchers.every(voucher => voucher.code !== code);
        
        if (isUnique) {
            vouchers.push({ code });
        }
        
        attempts++;
    }

    if (vouchers.length < numOfVouchers) {
        return res.status(500).json({ error: "Could not generate enough unique voucher codes" });
    }

    const newVoucherEntry = new Voucher({ userId: user._id, vouchers });

    try {
        await newVoucherEntry.save();
        res.status(201).json({ message: `${numOfVouchers} vouchers created successfully`, vouchers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const useVoucher = asyncHandler(async (req, res) => {
    const { code } = req.body;
    const userId = req.user._id; // Get user ID from request

    if (!code) {
        return res.status(400).json({ error: "Voucher code is required" });
    }

    // Find the voucher by its code and user ID
    const voucher = await Voucher.findOne({ 'vouchers.code': code, 'vouchers.userId': userId });

    if (!voucher) {
        return res.status(404).json({ error: "Voucher not found" });
    }

    // Check if the voucher is already used
    const voucherIndex = voucher.vouchers.findIndex(v => v.code === code && v.userId === userId);
    if (voucher.vouchers[voucherIndex].isUsed) {
        return res.status(400).json({ error: "Voucher has already been used" });
    }

    // Mark the voucher as used
    voucher.vouchers[voucherIndex].isUsed = true;
    await voucher.save();

    res.json({ message: "Voucher used successfully", voucher: voucher.vouchers[voucherIndex] });
});


module.exports = {
    createVoucher,
    useVoucher
};
