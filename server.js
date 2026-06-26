const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// IMPORT DARI MODELS
const { sequelize } = require('./models');

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// STATIC FILES
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ROUTES
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/suppliers', require('./routes/supplierRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;

// CONNECT DATABASE
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database Connected');

    // 🔥 FIX UTAMA: JANGAN PAKAI alter / force di production/dev normal
    await sequelize.sync();

    console.log('✅ Database Synced');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Database Error:', err);
  }
})();