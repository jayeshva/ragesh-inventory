const express = require('express');
const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const router = express.Router();

// Add product to inventory
router.post('/inventory', async (req, res) => {
  try {
    const { owner, productId, price, quantity } = req.body;
    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found', status: 0 });
    }
    const inventoryItem = new Inventory({ owner, productId, price, quantity });
    await inventoryItem.save();
    res.status(201).json({message:"Product added to inventory",product:inventoryItem, status:1});
  } catch (err) {
    res.status(500).json({ msg: err.message, status:0});
  }
});

// Get all inventory items for a shop owner
router.get('/inventory/:ownerId', async (req, res) => {
  try {
    const inventory = await Inventory.find({ owner: req.params.ownerId }).populate('product');
    res.json({message:"Product Fetched from inventory",products:inventory,status:1});
  } catch (err) {
    res.status(500).json({ msg: err.message, status:0 });
  }
});

// Update inventory item (price and quantity)
router.put('/inventory/:id', async (req, res) => {
  try {
    const { price, quantity } = req.body;
    const inventoryItem = await Inventory.findByIdAndUpdate(req.params.id, { price, quantity }, { new: true });
    res.json({message:"Product updated inventory",product: inventoryItem, status:1});
  } catch (err) {
    res.status(500).json({ msg: err.message, status:0 });
  }
});

// Delete an inventory item
router.delete('/inventory/:id', async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Inventory item deleted',status:1 });
  } catch (err) {
    res.status(500).json({ msg: err.message, status:0 });
  }
});

module.exports = router;
