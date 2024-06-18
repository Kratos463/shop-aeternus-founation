const mongoose = require("mongoose")
const bcryptjs = require("bcryptjs")

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: [true, "Please provide a username"],
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
        required: [true, "Please  provide a email"],
        unique: true,
        trim: true,
        index: true
    },
    phone: {
        type: String,
        required: [true, "Please  provide a phone number"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        index: true
    },
    newsletter: {
        type: Boolean,
        default: true,
    },
    mfvUser: {
        type: Boolean,
        default: false
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: {type: String, index: true}

}, { timestamps: true })

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) return next()

    this.password = await bcryptjs.hash(this.password, 16)
    next()
})


userSchema.methods.isPasswordCorrect = async function (password) {
    try {
        if (!password || typeof password !== 'string') {
            throw new Error("Invalid password");
        }
        return await bcryptjs.compare(password, this.password);
    } catch (error) {
        console.error("Error in isPasswordCorrect:", error);
        return false;
    }
}


const User = mongoose.models.users || mongoose.model("users", userSchema)

module.exports = User