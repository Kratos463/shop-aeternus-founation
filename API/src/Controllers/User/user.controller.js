const User = require("../../Models/user.model.js")
const Address = require("../../Models/address.model.js")
const { asyncHandler } = require('../../utils/asyncHandler.js')
const { ApiError } = require('../../utils/apiError.js')
const { ApiResponse } = require('../../utils/apiResponse.js')
const { serialize } = require("cookie")
const jwt = require("jsonwebtoken")

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, firstName, lastName, phone, password, newsletter } = req.body;

    if ([firstName, phone, username, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // Check if the request is coming from metafortunaverse
    const origin = req.get('origin') || req.get('referer');
    const isFromMetafortunaverse = origin && origin.includes('metafortunaverse.com');

    const user = await User.create({
        username: username,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
        password: password,
        newsletter: newsletter,
        mfvUser: isFromMetafortunaverse
    });

    const createdUser = await User.findById(user._id).select("-password");
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, "User Created", "User registered Successfully")
    );
});

const loginUser = asyncHandler(async (req, res) => {

    const { identifier, password } = req.body;

    if ([identifier, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Please provide all the fields information")
    }

    // Check if user exists with email or username
    const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }]
    });

    if (!user) {
        throw new ApiError(400, "User not exists")
    }

    // Validate the password
    const isValidPassword = await user.isPasswordCorrect(password)

    if (!isValidPassword) {
        throw new ApiError(400, "Invalid credentials")
    }

    // Create token data
    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.TOKEN_SECRET,
        { expiresIn: '7d' } // Token expiration
    );

    // Serialize the cookie
    const serializedCookie = serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Set the cookie header
    res.setHeader("Set-Cookie", serializedCookie);

    // Exclude sensitive information from the user object
    const loggedUser = user.toObject();
    delete loggedUser.password;

    return res.status(200).json({
        message: "Login successful",
        success: true,
        token: token
    })
})

const logoutUser = asyncHandler(async (req, res) => {
    res.setHeader(
        'Set-Cookie',
        serialize('accessToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 0, // Set Max-Age to zero to remove the cookie
        })
    );

    res.status(200).json({ message: "Logout successful" });
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "invalid old password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res.status(200).json(
        new ApiResponse(200, {}, "Password changed successfully")
    )

})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, req.user, "Current user fetched successfully")
    )
})

const updateUserDetails = asyncHandler(async (req, res) => {
    const { username, firstName, lastName, newsletter, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(req.user._id,
        { $set: { username, firstName, lastName, newsletter, phone } },
        { new: true, upsert: false, select: { password: 0 } }
    );

    if (!updatedUser) {
        throw new ApiError(400, "User not found")
    }

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "User details updated successfully")
    );

})

const addAddress = asyncHandler(async (req, res) => {
    const { address } = req.body;

    // Validate required fields
    if (!address || !address.firstName || !address.lastName || !address.email || !address.phone || !address.houseNo || !address.street || !address.landmark || !address.city || !address.state || !address.postalcode || !address.country) {
        return res.status(400).json({ error: "Please provide all the required information" });
    }

    // Check if the user already has an address
    let existingAddress = await Address.findOne({ userId: req.user._id });

    if (!existingAddress) {
        // If address doesn't exist for the user, create a new address object
        const newAddress = new Address({
            userId: req.user._id,
            address: {
                firstName: address.firstName,
                lastName: address.lastName,
                email: address.email,
                phone: address.phone,
                houseNo: address.houseNo,
                street: address.street,
                landmark: address.landmark,
                city: address.city,
                state: address.state,
                postalcode: address.postalcode,
                country: address.country,
                alternativePhone: address.alternativePhone
            }
        });

        // Save the new address object to the database
        await newAddress.save();

        return res.status(201).json(new ApiResponse(201, {}, "Address details added successfully"));
    } else {
        // If address exists for the user, add the new address to the existing address document
        existingAddress.address.push({
            firstName: address.firstName,
            lastName: address.lastName,
            email: address.email,
            phone: address.phone,
            houseNo: address.houseNo,
            street: address.street,
            landmark: address.landmark,
            city: address.city,
            state: address.state,
            postalcode: address.postalcode,
            country: address.country,
            alternativePhone: address.alternativePhone
        });

        // Save the updated address details
        await existingAddress.save();

        return res.status(200).json(new ApiResponse(200, {}, "Address details added successfully"));
    }
});

module.exports = { addAddress };


const getAddress = asyncHandler(async (req, res) => {

    // Retrieve the cart data associated with the userId
    const address = await Address.findOne({ userId: req.user._id });

    if (!address) {
        return new ApiError(400, "Address not found");
    }

    return res.status(200).json(new ApiResponse(200, address, "User address successfully fetched"));
})

const deleteAddress = asyncHandler(async (req, res) => {

    const { addressId } = req.params;
    console.log(addressId)
    if (!addressId) {
        throw new ApiError(400, "Address Id not provided")
    }

    // Find the user's cart in the database
    const address = await Address.findOne({ userId: req.user._id });

    if (!address) {
        return res.status(404).json({ error: "Address not found for the user." });
    }

    // Find the index of the item in the address
    const addressIndex = address.address.findIndex(item => item.id === addressId);

    if (addressIndex === -1) {
        return res.status(404).json({ error: "Address not found" });
    }

    // Remove the address from the user address 
    address.address.splice(addressIndex, 1);

    // Save the updated address to the database
    await address.save();

    // Return success response
    return res.status(200).json(new ApiResponse(200, {}, "Address Remove Successfully"));
})


const updateAddress = asyncHandler(async (req, res) => {
   

    const { address } = req.body;
    const { addressId } = address; 
    const address_Data =address.address;

    
    // Validate required fields
    if (!addressId) {
        return res.status(400).json({ error: "Address ID is required" });
    }

    // Find the user's address in the database
    const userAddress = await Address.findOne({ userId: req.user._id });
    // console.log(userAddress)

    if (!userAddress) {
        return res.status(404).json({ error: "User's address not found" });
    }

    // Find the address to be updated
    const addressToUpdate = userAddress.address.find(addr => addr._id.toString() === addressId);

    // console.log(addressToUpdate)

    if (!addressToUpdate) {
        return res.status(404).json({ error: "Address not found" });
    }

    // Update address fields if they are provided
    

    if (address_Data.firstName) addressToUpdate.firstName = address_Data.firstName;
    if (address_Data.lastName) addressToUpdate.lastName = address_Data.lastName;
    if (address_Data.email) addressToUpdate.email = address_Data.email;
    if (address_Data.phone) addressToUpdate.phone = address_Data.phone;
    if (address_Data.houseNo) addressToUpdate.houseNo = address_Data.houseNo;
    if (address_Data.street) addressToUpdate.street = address_Data.street;
    if (address_Data.landmark) addressToUpdate.landmark = address_Data.landmark;
    if (address_Data.city) addressToUpdate.city = address_Data.city;
    if (address_Data.state) addressToUpdate.state = address_Data.state;
    if (address_Data.postalcode) addressToUpdate.postalcode = address_Data.postalcode;
    if (address_Data.country) addressToUpdate.country = address_Data.country;
    if (address_Data.alternativePhone) addressToUpdate.alternativePhone = address_Data.alternativePhone;
    // console.log(userAddress)

    // Save the updated user address
    await userAddress.save();

    // Return success response
    return res.status(200).json({ message: "Address updated successfully", address: addressToUpdate });
});




module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    changeCurrentPassword,
    getCurrentUser,
    updateUserDetails,
    addAddress,
    deleteAddress,
    getAddress,
    updateAddress
}