const mongoose = require("mongoose")
const { DB_NAME } = require("../../constants");


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log("Sever Connected...")
    } catch (error) {
        console.error("Error while connecting database", error)
        process.exit(1)
    }
}

module.exports = { connectDB }