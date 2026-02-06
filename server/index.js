import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import joinRoutes from './routes/joinRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/joins", joinRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api", statsRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/resources", resourceRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Check if MONGO_URI is defined
if (!MONGO_URI) {
    console.error('❌ ERROR: MONGO_URI is not defined in .env file!');
    process.exit(1);
}

console.log('🔄 Connecting to MongoDB...');

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

app.get('/', (req, res) => {
    res.send('Server is running');
});
