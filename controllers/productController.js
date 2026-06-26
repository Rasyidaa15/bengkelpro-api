const { Product, Category, Supplier } = require('../models');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category, attributes: ['name'] },
        { model: Supplier, attributes: ['name'] }
      ],
      order: [['id', 'DESC']],
    });
    console.log('✅ Products found:', products.length);
    res.status(200).json(products);
  } catch (error) {
    console.error('❌ Error get products:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, attributes: ['name'] },
        { model: Supplier, attributes: ['name'] }
      ],
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, image, categoryId, supplierId } = req.body;
    if (!name || !price || !categoryId || !supplierId) {
      return res.status(400).json({ message: 'Name, price, categoryId, supplierId are required' });
    }
    const product = await Product.create({
      name: name.trim(),
      description: description || '',
      price,
      stock: stock || 0,
      image: image || '',
      categoryId,
      supplierId,
    });
    const newProduct = await Product.findByPk(product.id, {
      include: [
        { model: Category, attributes: ['name'] },
        { model: Supplier, attributes: ['name'] }
      ]
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('❌ Error create product:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.update(req.body);
    const updated = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, attributes: ['name'] },
        { model: Supplier, attributes: ['name'] }
      ]
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.destroy();
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};