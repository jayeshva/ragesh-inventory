const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  owner: { type: String, required: true },
  productId:{type: String, required: true},
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

module.exports = mongoose.model('Inventory', inventorySchema);
