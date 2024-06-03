const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

// Regular expression for email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
        trim: true,
        index: true
    },
    firstName: {
        type: String,
        trim: true,
        required: [true, "Please provide a first name"],
    },
    lastName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        trim: true,
        index: true,
        match: [emailRegex, "Please provide a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
    type: {
        type: String,
        enum: ["admin", "test"],
        default: "admin"
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
}, { timestamps: true });

adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcryptjs.hash(this.password, 16);
    next();
});

adminSchema.methods.isPasswordCorrect = async function (password) {
    try {
        if (!password || typeof password !== 'string') {
            throw new Error("Invalid password");
        }
        return await bcryptjs.compare(password, this.password);
    } catch (error) {
        console.error("Error in isPasswordCorrect:", error);
        return false;
    }
};

// Static method to find admin by email
adminSchema.statics.findByEmail = function (email) {
    return this.findOne({ email });
};

// Instance method to generate forgot password token
adminSchema.methods.generateForgotPasswordToken = function () {
    // Implementation to generate token and set expiry date
    // this.forgotPasswordToken = generatedToken;
    // this.forgotPasswordTokenExpiry = Date.now() + expirationTime;
};

const Admin = mongoose.models.admins || mongoose.model("admins", adminSchema);

module.exports = Admin;
