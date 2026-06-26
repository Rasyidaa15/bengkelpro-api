const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load .env
dotenv.config();

// IMPORT DARI MODELS
const { sequelize } = require('./models');

const app = express();

// ======================
// MIDDLEWARE
// ======================
app.use(cors({
  origin: process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',')
    : ['http://localhost:3000'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================
// STATIC FILES
// ======================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ======================
// ROUTES
// ======================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/suppliers', require('./routes/supplierRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// ======================
// TEST ROUTE
// ======================
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 BengkelPro API Running'
  });
});

// ======================
// ERROR HANDLER
// ======================
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: err.message,
  });
});

// ======================
// START SERVER
// ======================
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    // Test koneksi database
    await sequelize.authenticate();
    console.log('✅ Database Connected');

    // JANGAN sync kalau database sudah di-import
    // await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Database Error:', error);
    process.exit(1);
  }
})();
