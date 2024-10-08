const express = require('express');
const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const router = express.Router();

// Add product to inventory
router.post('/inventory', async (req, res) => {
  try {
    const {productId, price, quantity,productName } = req.body;
    const owner = req.user.email;
    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found', status: 0 });
    }
    const inventoryItem = new Inventory({ owner, productId, price, quantity, productName });
    await inventoryItem.save();
    res.status(201).json({message:"Product added to inventory",product:inventoryItem, status:1});
  } catch (err) {
    res.status(500).json({ msg: err.message, status:0});
  }
});

// Get all inventory items for a shop owner
router.get('/inventory', async (req, res) => {
  try {
    const owner = req.user.email;
    const inventory = await Inventory.find({ owner: owner }).populate('product');
    res.json({message:"Product Fetched from inventory",products:inventory,status:1});
  } catch (err) {
    res.status(500).json({ msg: err.message, status:0 });
  }
});

// Get all the products added by admin
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({message:"Product Fetched successfully", products:products, status:1});
  } catch (err) {
    res.status(500).json({ msg: err.message,status:0  });
  }
});

// Get a single inventory item by productId
router.get('/inventory/:productId', async (req, res) => {
  try {
    const owner = req.user.email;
    // Find inventory item by productId
    const inventoryItem = await Inventory.findOne({ productId: req.params.productId, owner: owner  });

    if (!inventoryItem) {
      return res.status(404).json({ message: "Inventory item not found", status: 0 });
    }

    res.json({ message: "Inventory item fetched successfully", product: inventoryItem, status: 1 });
  } catch (err) {
    res.status(500).json({ msg: err.message, status: 0 });
  }
});


// Update inventory item by productId (price and quantity)
router.put('/inventory/:productId', async (req, res) => {
  try {
    const { price, quantity,productName } = req.body;
    const owner = req.user.email;

    // Find inventory item by productId and update
    const inventoryItem = await Inventory.findOneAndUpdate(
      { productId: req.params.productId ,  owner: owner },
      { price, quantity , productName},
      { new: true }
    );

    if (!inventoryItem) {
      return res.status(404).json({ message: "Inventory item not found", status: 0 });
    }

    res.json({ message: "Product updated in inventory", product: inventoryItem, status: 1 });
  } catch (err) {
    res.status(500).json({ msg: err.message, status: 0 });
  }
});

// Delete an inventory item by productId
router.delete('/inventory/:productId', async (req, res) => {
  try {
    const owner = req.user.email;
    // Find and delete the inventory item by productId
    const inventoryItem = await Inventory.findOneAndDelete({ productId: req.params.productId, owner: owner });

    if (!inventoryItem) {
      return res.status(404).json({ message: "Inventory item not found", status: 0 });
    }

    res.json({ msg: 'Inventory item deleted', status: 1 });
  } catch (err) {
    res.status(500).json({ msg: err.message, status: 0 });
  }
});






module.exports = router;
