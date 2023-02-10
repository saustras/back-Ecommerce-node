'use strict';

const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var ReviewSchema = new mongoose.Schema({
  producto: { type: mongoose.Schema.ObjectId, ref: 'producto', required: true },
  cliente: { type: mongoose.Schema.ObjectId, ref: 'cliente', required: true },
  venta: { type: mongoose.Schema.ObjectId, ref: 'venta', required: true },
  review: { type: String, required: false },
  estrellas: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now(), required: true },
});

//Export the model
module.exports = mongoose.model('review', ReviewSchema);
