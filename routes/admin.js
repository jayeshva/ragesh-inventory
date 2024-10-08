const express = require('express');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');

const router = express.Router();

// Add a new product
router.post('/products', async (req, res) => {
  try {
    const { name, category, imageUrl, productId } = req.body;
    const createdBy = req.user.email;
    const product = new Product({ name, category, imageUrl,productId,createdBy });
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

// Get a single product by productId
router.get('/products/:productId', async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.productId });

    if (!product) {
      return res.status(404).json({ message: "Product not found", status: 0 });
    }

    res.json({ message: "Product fetched successfully", product: product, status: 1 });
  } catch (err) {
    res.status(500).json({ msg: err.message, status: 0 });
  }
});


// Update a product by productId
router.put('/products/:productId', async (req, res) => {
  try {
    const { name, category, imageUrl } = req.body;
    
    // Find product by productId and update it
    const product = await Product.findOneAndUpdate(
      { productId: req.params.productId },
      { name, category, imageUrl },
      { new: true }  // Return the updated product
    );
    
    if (!product) {
      return res.status(404).json({ message: "Product not found", status: 0 });
    }

    res.json({ message: "Product updated successfully", product: product, status: 1 });
  } catch (err) {
    res.status(500).json({ msg: err.message, status: 0 });
  }
});

// Delete a product by productId
router.delete('/products/:productId', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ productId: req.params.productId });

    if (!product) {
      return res.status(404).json({ message: "Product not found", status: 0 });
    }

    res.json({ msg: 'Product deleted', status: 1 });
  } catch (err) {
    res.status(500).json({ msg: err.message, status: 0 });
  }
});

// Fetch the shopowner data and inventory data by admin using email
router.get('/inventory/:email', async (req, res) => {
  try {
    const { email } = req.params;

    // Find the shop owner by email
    const shopOwner = await User.findOne({ email, role: 'shopOwner' });

    if (!shopOwner) {
      return res.status(404).json({ message: 'Shop owner not found', status: 0 });
    }

    // Find the inventory of the shop owner by their ID
    const inventory = await Inventory.find({ owner: email }).populate('product');

    res.json({
      message: "Shop owner and inventory data fetched successfully",
      shopOwner: {
        id: shopOwner._id,
        name: shopOwner.name,
        email: shopOwner.email
      },
      inventory: inventory,
      status: 1
    });
  } catch (err) {
    res.status(500).json({ message: err.message, status: 0 });
  }
});


module.exports = router;
