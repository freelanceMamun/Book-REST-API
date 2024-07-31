import mongoose from "mongoose";
import { User } from "./userTypes";
const userSchemna = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model<User>("User", userSchemna);

export default User;
