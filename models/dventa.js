'use strict';

const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var DventasSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.ObjectId, ref: 'cliente', required: true },
  producto: { type: mongoose.Schema.ObjectId, ref: 'producto', required: true },
  venta: { type: mongoose.Schema.ObjectId, ref: 'venta', required: true },
  subtotal: { type: Number, required: true },
  variedad: { type: String, required: false },
  cantidad: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now(), required: true },
});

//Export the model
module.exports = mongoose.model('dventas', DventasSchema);
