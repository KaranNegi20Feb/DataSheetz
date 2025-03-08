import mongoose from 'mongoose';

const connectDB = async () => {
    if (mongoose.connections[0].readyState) {
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URI || 'your_mongo_uri');
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;