const express = require('express');
const cors = require('cors');
require('dotenv').config();

// =====================
// INIT APP
// =====================
const app = express();

// =====================
// MIDDLEWARE
// =====================
app.use(cors());
app.use(express.json());

// =====================
// ROUTES
// =====================
const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);

// =====================
// TEST ROUTE
// =====================
app.get('/', (req, res) => {
  res.json({
    message: 'API berjalan 🚀',
    status: 'success'
  });
});

// =====================
// HANDLE 404
// =====================
app.use((req, res) => {
  res.status(404).json({
    message: 'Route tidak ditemukan'
  });
});

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
