const { Order, OrderItem, Product, Service, User } = require('../models');

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, attributes: ['name', 'email'] },
        { model: OrderItem, include: [
          { model: Product, attributes: ['name'] },
          { model: Service, attributes: ['name'] }
        ]}
      ],
      order: [['orderDate', 'DESC']],
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [
        { model: User, attributes: ['name', 'email'] },
        { model: OrderItem, include: [
          { model: Product, attributes: ['name'] },
          { model: Service, attributes: ['name'] }
        ]}
      ],
      order: [['orderDate', 'DESC']],
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createOrder = async (req, res) => {
  const { items, address, phone, paymentMethod } = req.body;
  let total = 0;
  const orderItemsData = [];
  try {
    // Cek apakah ada produk fisik
    const hasProduct = items.some(item => item.productId);

    // Validasi alamat hanya jika ada produk fisik
    if (hasProduct && (!address || address.trim() === '')) {
      return res.status(400).json({ message: 'Alamat pengiriman wajib diisi untuk pembelian produk' });
    }

    for (const item of items) {
      let product = null;
      let service = null;
      let price = 0;

      if (item.productId) {
        product = await Product.findByPk(item.productId);
        if (!product) return res.status(404).json({ message: `Product ${item.productId} not found` });
        if (product.stock < item.quantity) return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
        price = product.price;
      } else if (item.serviceId) {
        service = await Service.findByPk(item.serviceId);
        if (!service) return res.status(404).json({ message: `Service ${item.serviceId} not found` });
        price = service.price;
      } else {
        return res.status(400).json({ message: 'Each item must have productId or serviceId' });
      }

      total += price * item.quantity;
      orderItemsData.push({
        productId: product ? product.id : null,   // <-- PASTIKAN NULL UNTUK JASA
        serviceId: service ? service.id : null,   // <-- PASTIKAN NULL UNTUK PRODUK
        quantity: item.quantity,
        price: price
      });
    }

    const order = await Order.create({
      userId: req.user.id,
      total,
      address: address && address.trim() !== '' ? address : 'Servis di bengkel (tanpa alamat)',
      phone,
      paymentMethod,
      status: 'pending',
    });

    for (const item of orderItemsData) {
      // BUAT OrderItem dengan productId dan serviceId yang mungkin null
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,  // bisa null
        serviceId: item.serviceId,  // bisa null
        quantity: item.quantity,
        price: item.price,
      });

      // Update stok produk jika ada produk
      if (item.productId) {
        const product = await Product.findByPk(item.productId);
        if (product) {
          product.stock -= item.quantity;
          await product.save();
        }
      }
    }

    const newOrder = await Order.findByPk(order.id, {
      include: [
        { model: User, attributes: ['name', 'email'] },
        { model: OrderItem, include: [
          { model: Product, attributes: ['name'] },
          { model: Service, attributes: ['name'] }
        ]}
      ]
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = req.body.status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};