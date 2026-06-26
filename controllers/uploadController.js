const path = require('path');
const fs = require('fs');
const { Order } = require('../models');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

exports.uploadProof = async (req, res) => {
  try {
    const { orderId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'File tidak ditemukan' });
    }
    if (!orderId) {
      return res.status(400).json({ message: 'Order ID diperlukan' });
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order tidak ditemukan' });
    }

    // Hapus file bukti lama jika ada
    if (order.proof) {
      const oldPath = path.join(uploadDir, order.proof);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    order.proof = file.filename;
    await order.save();

    res.status(200).json({ message: 'Bukti berhasil diupload', filename: file.filename });
  } catch (error) {
    console.error('Upload proof error:', error);
    res.status(500).json({ message: error.message });
  }
};