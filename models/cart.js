'use strict';

const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var CartSchema = new mongoose.Schema({
  producto: { type: mongoose.Schema.ObjectId, ref: 'producto', required: true },
  cliente: { type: mongoose.Schema.ObjectId, ref: 'cliente', required: true },
  caracteristica: { type: String, required: false },
  cantidad: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now(), required: true },
});

//Export the model
module.exports = mongoose.model('cart', CartSchema);
