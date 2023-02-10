'use strict';

const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var InventarioSchema = new mongoose.Schema({
  producto: { type: mongoose.Schema.ObjectId, ref: 'producto', required: true },
  admin: { type: mongoose.Schema.ObjectId, ref: 'admin', required: true },
  cantidad: { type: Number, required: true },
  proveedor: { type: String, required: true },
  createdAt: { type: Date, default: Date.now(), required: true },
});

//Export the model
module.exports = mongoose.model('inventario', InventarioSchema);
