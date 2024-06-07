const { asyncHandler } = require("../../utils/asyncHandler");
const { generateVoucherCode } = require("../../../constants");
const User = require("../../Models/user.model");
const Voucher = require("../../Models/voucher.model");
const { ApiResponse } = require("../../utils/apiResponse");
const { ApiError } = require("../../utils/apiError");


const createVoucher = asyncHandler(async (req, res) => {
    try {
        const { email, numOfVouchers } = req.body;

        if (!email || !numOfVouchers) {
            throw new ApiError(400, "Email and number of vouchers are required");
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(400, "User not found");
        }

        // Check if the user is of type 'mfvUser' (mfvUser === true)
        if (user.mfvUser !== true) {
            throw new ApiError(403, "User is not eligible to create vouchers");
        }

        let existingVoucherEntry = await Voucher.findOne({ userId: user._id });

        const vouchers = [];
        let attempts = 0;
        while (vouchers.length < numOfVouchers && attempts < 1000) {
            const code = generateVoucherCode();

            const isUniqueInNewVouchers = vouchers.every(voucher => voucher.code !== code);

            const isUniqueInExistingVouchers = !existingVoucherEntry || existingVoucherEntry.vouchers.every(voucher => voucher.code !== code);

            if (isUniqueInNewVouchers && isUniqueInExistingVouchers) {
                vouchers.push({ code });
            }

            attempts++;
        }

        if (vouchers.length < numOfVouchers) {
            throw new ApiError(400, "Could not generate enough unique voucher codes");
        }

        if (existingVoucherEntry) {
            // Append new vouchers to existing entry
            existingVoucherEntry.vouchers.push(...vouchers);
            await existingVoucherEntry.save();
            return res.status(200).json(new ApiResponse(200, vouchers, `${numOfVouchers} vouchers added successfully`));
        } else {
            // Create a new voucher entry
            const newVoucherEntry = new Voucher({ userId: user._id, vouchers });
            await newVoucherEntry.save();
            return res.status(200).json(new ApiResponse(200, vouchers, `${numOfVouchers} vouchers created successfully`));
        }
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});


const useVoucher = asyncHandler(async (req, res) => {
    const { code } = req.body;
    const userId = req.user._id;

    if (!code) {
        return res.status(400).json({ error: "Voucher code is required" });
    }

    const voucher = await Voucher.findOne({ 'vouchers.code': code, 'userId': userId });

    if (!voucher) {
        return res.status(404).json({ error: "Voucher not found" });
    }

    const voucherIndex = voucher.vouchers.findIndex(v => v.code === code);
    if (voucher.vouchers[voucherIndex].isUsed) {
        return res.status(400).json({ error: "Voucher has already been used" });
    }

    voucher.vouchers[voucherIndex].isUsed = true;
    await voucher.save();

    res.json({ message: "Voucher used successfully", voucher: voucher.vouchers[voucherIndex] });
});

const displayVouchers = asyncHandler(async (req, res) => {
    try {
        const { email } = req.query;
        const userId = req.user ? req.user._id : null;

        if (!userId && !email) {
            return res.status(400).json({ error: "Either userId or email is required" });
        }

        let user;

        if (userId) {
            user = await User.findOne({ _id: userId }).lean().exec();
        } else {
            user = await User.findOne({ email }).lean().exec();
        }

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const vouchersEntry = await Voucher.findOne({ userId: user._id }).lean().exec();

        if (!vouchersEntry) {
            return res.status(404).json({ error: "No vouchers found for this user" });
        }

        return res.status(200).json(new ApiResponse(200, vouchersEntry, "vouchers fetched successfully"));
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});


module.exports = {
    createVoucher,
    useVoucher,
    displayVouchers
};
