require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const donorRoutes = require('./routes/donors');
const bloodRoutes = require('./routes/blood');
const donationRoutes = require('./routes/donations');
const requestRoutes = require('./routes/requests');
const campRoutes = require('./routes/camps');
const adminRoutes = require('./routes/admin');

const { seedDatabase } = require('./services/seedService');

connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'LifeLink API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/blood', bloodRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/camps', campRoutes);
app.use('/api/admin', adminRoutes);

const { notFound, errorHandler } = require('./middleware/error');
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await seedDatabase();
});
