const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// CORS Configuration for dual environment
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5500',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:5500',
            'https://mohinhcaocap.wavestore.id.vn',
            'http://mohinhcaocap.wavestore.id.vn'
        ];
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(null, true); // Allow all for now, can be restricted later
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static('uploads'));

// MongoDB Connection with increased timeout for international connections
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Increase to 30 seconds
    socketTimeoutMS: 45000, // Increase to 45 seconds
    connectTimeoutMS: 30000 // Increase to 30 seconds
})
    .then(() => {
        console.log('✅ MongoDB Connected');
        console.log(`🌍 Environment: ${process.env.ENVIRONMENT || 'production'}`);
        console.log(`📊 Database: ${process.env.MONGODB_URI.includes('localhost') ? 'Local' : 'Cloud (Atlas)'}`);
    })
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/brands', require('./routes/brands'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/upload', require('./routes/upload'));

// Root route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Mô Hình Cao Cấp API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            products: '/api/products',
            categories: '/api/categories',
            brands: '/api/brands',
            auth: '/api/auth/login',
            admin: '/admin'
        }
    });
});

// Admin endpoint removed (served by nginx)

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Local API: http://localhost:${PORT}/api`);
    console.log(`🌐 Environment: ${process.env.ENVIRONMENT || 'production'}`);
    
    if (process.env.ENVIRONMENT === 'local') {
        console.log('🔧 Running in LOCAL mode - using cloud database');
        console.log('💡 Frontend should use: http://localhost:5000/api');
    } else {
        console.log('🚀 Running in PRODUCTION mode');
    }
});
