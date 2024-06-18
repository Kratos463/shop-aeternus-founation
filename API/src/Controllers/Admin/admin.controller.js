const Admin = require('../../Models/admin.model');
const { ApiError } = require('../../utils/apiError');
const { ApiResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { serialize } = require("cookie")
const jwt = require("jsonwebtoken")

// POST add a new admin
const registerAdmin = asyncHandler(async (req, res) => {
    try {
        const { username, email, firstName, lastName, password, type } = req.body;

        if ([firstName, type, username, email, password].some(field => !field?.trim())) {
            throw new ApiError(400, "All fields are required");
        }

        // Ensure that email and username have indexes
        const existedAdmin = await Admin.findOne({
            $or: [{ username }, { email }]
        }).lean().exec();

        if (existedAdmin) {
            throw new ApiError(409, "Admin with email or username already exists");
        }

        const admin = new Admin({
            username,
            firstName,
            lastName,
            email,
            password, // Make sure password hashing is optimized
            type
        });

        await admin.save();

        return res.status(201).json(new ApiResponse(201, "User Created", "User registered Successfully"));
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
})

const loginAdmin = asyncHandler(async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if ([identifier, password].some(field => !field?.trim())) {
            throw new ApiError(400, "Please provide all the fields information");
        }

        // Check if user exists with email or username
        const admin = await Admin.findOne({
            $or: [{ email: identifier }, { username: identifier }]
        }).exec();

        if (!admin) {
            throw new ApiError(400, "User does not exist");
        }

        // Validate the password
        const isValidPassword = await admin.isPasswordCorrect(password);

        if (!isValidPassword) {
            throw new ApiError(400, "Invalid credentials");
        }

        // Create token data
        const token = jwt.sign(
            { id: admin._id, email: admin.email }, 
            process.env.TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // Serialize the cookie
        const serializedCookie = serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 1,
        });

        // Set the cookie header
        res.setHeader("Set-Cookie", serializedCookie);

        // Exclude sensitive information from the user object
        const loggedAdmin = admin.toObject();
        delete loggedAdmin.password;

        return res.status(200).json({
            message: "Login successful",
            success: true,
            token: token
        });
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});

const logoutAdmin = asyncHandler(async (req, res) => {
    try {
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

    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }

});

module.exports = { registerAdmin, loginAdmin, logoutAdmin };
