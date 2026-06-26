const express = require('express');
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

router.route('/')
  .get(protect, getServices)
  .post(protect, admin, createService); // <-- PASTIKAN POST

router.route('/:id')
  .get(protect, getServiceById)
  .put(protect, admin, updateService)
  .delete(protect, admin, deleteService);

module.exports = router;