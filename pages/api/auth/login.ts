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
  token: string;
}

export default async function login(req: NextApiRequest, res: NextApiResponse<ErrorResponse | SuccessResponse>) {
    await connectDB();

    const { username, password } = req.body;

    try {
        const user = await UserNew.findOne({ username });
        if (!user) {
            console.error('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.error('Invalid credentials');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1h' }
        );
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in', error: (error as Error).message });
    }
}