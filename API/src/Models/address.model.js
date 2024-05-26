const mongoose = require("mongoose")

const addressSChema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    address: [
        {
            firstName: {
                type: String,
                required: [true, "Please provide a first name"],
            },
            lastName: {
                type: String,
            },
            email: {
                type: String,
            },
            phone: {
                type: String,
                required: [true, "Please  provide a phone number"],
            },
            alternativePhone: {
                type: String,
                trim: true
            },
            houseNo: {
                type: String,
                trim: true
            },
            street: {
                type: String,
                required: [true, "Please provide a street information"],
                trim: true
            },
            landmark: {
                type: String,
                trim: true
            },
            city: {
                type: String,
                required: true,
                trim: true
            },
            state: {
                type: String,
                required: true,
                trim: true
            },
            postalcode: {
                type: String,
                required: true,
                trim: true
            },
            country: {
                type: String,
                required: true,
                trim: true
            },
        }
    ]
})

const Address = mongoose.models.address || mongoose.model("address", addressSChema)

module.exports = Address