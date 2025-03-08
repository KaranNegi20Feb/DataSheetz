import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserNew from '../../../models/userModel';
import connectDB from '../../../lib/dbConnect';

interface ErrorResponse {
  message: string;
  error?: string;
}

interface SuccessResponse {
  message: string;
  token: string;
}

export default async function register(req: NextApiRequest, res: NextApiResponse<ErrorResponse | SuccessResponse>) {
    await connectDB();

    const { username, password, email } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await UserNew.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this username or email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserNew({ username, password: hashedPassword, email });
        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id, username: newUser.username },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1h' }
        );

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user', error: (error as Error).message });
    }
}