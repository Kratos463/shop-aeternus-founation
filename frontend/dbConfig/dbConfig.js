import mongoose from "mongoose";

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URI);
        const connection = mongoose.connection

        connection.on('connected', () => {
            console.log('Mongo db connected successfully')
        })

        connection.on('error', (err) => {
            console.log("Mongodb connection error. Please make sure MongoDB is running", err)
            process.exit()
        })
    } catch (error) {
        console.log("Error while connecting the database", error)
    }
}