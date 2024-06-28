import mongoose from "mongoose";
import { DB_NAME } from "../constants";

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URL}/${DB_NAME}`
    );
    console.log(
      "MONGO DB connected:::Host :",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.log("MongDB Error", error);
    process.exit(1);
  }
};
