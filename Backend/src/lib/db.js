import mongoose from "mongoose";

export const connectionDB = async () =>{
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongo Db connection Successful with host : ",connection.connection.host);
    } catch (error) {
        console.log("error while connection mongodb : ",error)
        process.exit(1);
    }
}


