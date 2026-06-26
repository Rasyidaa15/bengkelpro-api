const { Supplier } = require('../models');

exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({
      order: [['createdAt', 'DESC']],
    });
    console.log('✅ Supplier ditemukan:', suppliers.length);
    res.status(200).json(suppliers);
  } catch (error) {
    console.error('❌ Error get suppliers:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier tidak ditemukan' });
    }
    res.status(200).json(supplier);
  } catch (error) {
    console.error('❌ Error get supplier by id:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.createSupplier = async (req, res) => {
  try {
    const { name, contact, address } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Nama supplier wajib diisi' });
    }
    const supplier = await Supplier.create({
      name: name.trim(),
      contact: contact || '',
      address: address || '',
    });
    console.log('✅ Supplier baru dibuat:', supplier);
    res.status(201).json(supplier);
  } catch (error) {
    console.error('❌ Error create supplier:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier tidak ditemukan' });
    }
    await supplier.update(req.body);
    res.status(200).json(supplier);
  } catch (error) {
    console.error('❌ Error update supplier:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier tidak ditemukan' });
    }
    await supplier.destroy();
    res.status(200).json({ message: 'Supplier berhasil dihapus' });
  } catch (error) {
    console.error('❌ Error delete supplier:', error);
    res.status(500).json({ message: error.message });
  }
};