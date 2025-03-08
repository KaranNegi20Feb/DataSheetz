import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
    username: string;
    password: string;
    email: string;
}

const userSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
});

const UserNew = mongoose.models.UserNew || mongoose.model<IUser>('UserNew', userSchema);

export default UserNew;