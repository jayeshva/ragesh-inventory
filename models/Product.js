const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  productId:{type:String, required:true, unique: true},
  category: { type: String, required: true },
  imageUrl: { type: String },
  createdBy:{type:String,required:true},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);
