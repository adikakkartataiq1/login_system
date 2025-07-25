const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const appRoutes = require('./routes/appRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cookieParser = require('cookie-parser')
const errorHandler = require('./error/errorHandler');
const loggerContextMiddleware = require('./middleware/loggerContext');
const logger = require('./logger');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('./cron/scheduler');

dotenv.config();

const app = express();

// ✅ Security headers (clickjacking protection, etc.)
app.use(helmet({ frameguard: { action: 'deny' } }));

// ✅ Global rate limiter (applies to all incoming requests)
const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50, // Allow up to 50 requests per minute per IP
  message: 'Too many requests. Please try again later.',
});
app.use(globalLimiter);

app.use(cors({
  origin: process.env.FRONTEND_LINK,
  credentials: true,
}));

app.use(express.json());
app.use(loggerContextMiddleware);
app.use(cookieParser());




app.use((req, res, next) => {
  logger.info(`Incoming Request: ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api', authRoutes);
app.use('/api', appRoutes);
app.use('/api', adminRoutes);

app.use('/api/health',(req,res)=>{
 res.json({ message: 'Backend is working fine' });
  }
)

// Serve the root of the built frontend (index.html and such)
app.use(express.static(path.join(__dirname, './frontend/admin/dist')));

// // ✅ Catch-all route to serve frontend for non-API paths
app.get("/admin/", (req, res) => {
  res.sendFile(path.join(__dirname, './frontend/admin/dist/index.html'));
});

app.use(express.static(path.join(__dirname, './frontend/user/dist')));

// // ✅ Catch-all route to serve frontend for non-API paths
app.get("/user/", (req, res) => {
  res.sendFile(path.join(__dirname, './frontend/user/dist/index.html'));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`App is running on port ${PORT}`);
});

