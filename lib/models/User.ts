// models/User.ts
import mongoose, { Document, Model } from "mongoose";

export interface IUser {
  email: string;
  password?: string;
  // add other fields here if you have them
}

export interface IUserDocument extends IUser, Document {}

const UserSchema = new mongoose.Schema<IUserDocument>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

// Ensure we reuse the compiled model in watch / serverless environments
const User: Model<IUserDocument> =
  (mongoose.models.User as Model<IUserDocument>) ||
  mongoose.model<IUserDocument>("User", UserSchema);

export default User;