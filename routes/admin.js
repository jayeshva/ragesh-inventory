const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// Add a new product
router.post('/products', async (req, res) => {
  try {
    const { name, category, imageUrl, productId } = req.body;
    const product = new Product({ name, category, imageUrl,productId });
    await product.save();
    res.status(201).json({message:"Product added successfully", product:product, status:1});
  } catch (err) {
    res.status(500).json({ msg: err.message, status:0});
  }
});

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({message:"Product Fetched successfully", products:products, status:1});
  } catch (err) {
    res.status(500).json({ msg: err.message,status:0  });
  }
});

// Update a product
router.put('/products/:id', async (req, res) => {
  try {
    const { name, category, imageUrl } = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, { name, category, imageUrl }, { new: true });
    res.json({message:"Product updated successfully", product:product, status:1});
  } catch (err) {
    res.status(500).json({ msg: err.message,status:0 });
  }
});

// Delete a product
router.delete('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Product deleted',status:1 });
  } catch (err) {
    res.status(500).json({ msg: err.message,status:0 });
  }
});

module.exports = router;
