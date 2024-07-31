import mongoose from "mongoose";
import { config } from "./config";
const databaseURL = `${config.DBURLNAME}/${config.DBNAME}`;

const connectDB = async () => {
  try {
    mongoose.connection.on("connected" as string, () => {
      console.log("Connected Successfully Database");
    });

    mongoose.connection.on("error" as string, (err) => {
      console.log("Connected Error to database", err);
    });

    await mongoose.connect(databaseURL as string);
  } catch (error) {
    console.log("Faild  to connect to database");
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
