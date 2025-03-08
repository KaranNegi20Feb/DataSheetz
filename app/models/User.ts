import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

// Define TypeScript interface for User
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Add method to compare passwords
UserSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
