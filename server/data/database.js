import mongoose from "mongoose";


export const connectDB = () => {
    mongoose
        .connect(process.env.MONGO_URI
            , {
                dbName: "Pro-Manage",
                autoIndex: true,
            })
        .then((c) => console.log("Database connected"))
        .catch((error) => console.log("Database connection error:", error));
};