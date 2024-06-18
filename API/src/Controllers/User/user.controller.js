const User = require("../../Models/user.model.js")
const Address = require("../../Models/address.model.js")
const { asyncHandler } = require('../../utils/asyncHandler.js')
const { ApiError } = require('../../utils/apiError.js')
const { ApiResponse } = require('../../utils/apiResponse.js')
const { serialize } = require("cookie")
const jwt = require("jsonwebtoken")
const { generateVerificationToken, sendVerificationEmail } = require("../../utils/sendEmailVerification.js")

const verifyEmail = async (req, res) => {
    try {
        // Extract the verification token from the request parameters
        const { token } = req.query;

        // Validate the verification token format and uniqueness
        if (!token) {
            return res.status(400).json({ error: 'Verification token is missing' });
        }

        // Find the user with the corresponding verification token
        const user = await User.findOne({ emailVerificationToken: token });

        // If no user found with the verification token, handle accordingly
        if (!user) {
            return res.status(404).json({ error: 'Invalid verification token' });
        }

        // If the user is already verified, handle accordingly
        if (user.emailVerified) {
            return res.status(400).json({ error: 'Email already verified' });
        }

        // Set the emailVerified flag to true and remove the verification token
        user.emailVerified = true;
        user.emailVerificationToken = undefined;

        // Save the updated user data
        await user.save();

        // Respond with a success message
        return res.status(200).json({ message: 'Email verification successful' });
    } catch (error) {
        console.error('Error verifying email:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// register user api endpoint
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, firstName, lastName, phone, password, newsletter } = req.body;

    try {
        if (![firstName, phone, username, email, password].every(field => field && field.trim())) {
            return res.status(400).json({ error: { message: "All fields are required" } });
        }

        const verificationToken = await generateVerificationToken();

        // Check if the request is coming from metafortunaverse
        const origin = req.get('origin') || req.get('referer');
        const isFromMetafortunaverse = origin && origin.includes('metafortunaverse.com');

        let user = await User.findOne({ $or: [{ email }, { phone }] }).exec();

        if (user) {
            if (isFromMetafortunaverse) {
                if (!user.mfvUser) {
                    // If request comes from metafortunaverse and user is not already registered with mfvUser true
                    user.mfvUser = true;
                    await user.save();
                    return res.status(200).json(new ApiResponse(200, "User Updated", "User updated to metafortunaverse.com user"));
                } else {
                    // If request comes from metafortunaverse and user is already registered with mfvUser true
                    return res.status(200).json(new ApiResponse(200, "User Already Registered", "User already registed to metafortunaverse.com user"));
                }
            } else {
                // If request comes from a different domain and user already exists
                return res.status(409).json({ error: { message: "User with email or phone already exists" } });
            }
        } else {
            // Register new user
            user = new User({
                username,
                firstName,
                lastName,
                phone,
                email,
                password,
                newsletter,
                mfvUser: isFromMetafortunaverse,
                emailVerificationToken: verificationToken
            });

            await user.save(); // Save the user

            if (isFromMetafortunaverse) {
                return res.status(200).json(new ApiResponse(200, "User Created", "User registered Successfully"));
            } else {
                return res.status(200).json(new ApiResponse(200, "User Created", "User registered Successfully"));
            }
        }
    } catch (error) {
        console.error('Error during user registration:', error);
        return res.status(500).json({ error: { message: "Internal Server Error " } });
    }
});


// login user api endpoint

const loginUser = asyncHandler(async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if ([identifier, password].some(field => !field?.trim())) {
            throw new ApiError(400, "Please provide all the fields information");
        }

        // Check if user exists with email or username
        const user = await User.findOne({
            $or: [{ email: identifier }, { username: identifier }]
        }).exec();

        if (!user) {
            throw new ApiError(400, "User does not exist");
        }

        if (!user.emailVerified) {
            // Send verification email again if user is not verified
            await sendVerificationEmail(user.email, user.emailVerificationToken);
            return res.status(200).json({
                message: "Email not verified",
                success: true,
                token: "",
                emailVerified: user.emailVerified
            });
        }

        const isValidPassword = await user.isPasswordCorrect(password);

        if (!isValidPassword) {
            throw new ApiError(400, "Invalid credentials");
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.TOKEN_SECRET,
            { expiresIn: '7d' } // Token expiration
        );

        const serializedCookie = serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        res.setHeader("Set-Cookie", serializedCookie);

        const loggedUser = user.toObject();
        delete loggedUser.password;

        return res.status(200).json({
            message: "Login successful",
            success: true,
            token: token,
            emailVerified: user.emailVerified
        });
    } catch (error) {
        // Check if the error is an ApiError, indicating an expected error
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                message: error.message,
                success: false
            });
        } else {
            // If it's an unexpected error, return a generic error message
            console.error('Error during user login:', error);
            return res.status(500).json({
                message: "Internal Server Error",
                success: false
            });
        }
    }
});


// logout user api endpoint
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


// change current password api endpoint
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


// get current user details api endpoint
const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, req.user, "Current user fetched successfully")
    )
})

// update user profile details api endpoint
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


// get all users
const getAllUsers = asyncHandler(async(req,res)=> {
    try {
        const users = await User.find().select('-password -emailVerificationToken');;
        res.status(200).json(users);
      } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
      }
})


// add address api end point
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

// get address api endpoint
const getAddress = asyncHandler(async (req, res) => {

    // Retrieve the cart data associated with the userId
    const address = await Address.findOne({ userId: req.user._id });

    if (!address) {
        return new ApiError(400, "Address not found");
    }

    return res.status(200).json(new ApiResponse(200, address, "User address successfully fetched"));
})

// delete address api endpoint
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


// update address api endpoint
const updateAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params;
    const { address } = req.body;

    // Validate required fields
    if (!addressId) {
        throw new ApiError(400, "Address Id not provided");
    }

    if (!address || !address.firstName || !address.lastName || !address.email || !address.phone || !address.houseNo || !address.street || !address.landmark || !address.city || !address.state || !address.postalcode || !address.country) {
        return res.status(400).json({ error: "Please provide all the required information" });
    }

    // Find the user's address document in the database
    const userAddress = await Address.findOne({ userId: req.user._id });

    if (!userAddress) {
        return res.status(404).json({ error: "Address not found for the user." });
    }

    // Find the address by addressId within the user's addresses
    const addressIndex = userAddress.address.findIndex(item => item.id === addressId);

    if (addressIndex === -1) {
        return res.status(404).json({ error: "Address not found" });
    }

    // Update the address fields
    userAddress.address[addressIndex] = {
        ...userAddress.address[addressIndex],
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
    };

    await userAddress.save();

    return res.status(200).json(new ApiResponse(200, {}, "Address updated successfully"));
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
    updateAddress,
    verifyEmail,
    getAllUsers
}