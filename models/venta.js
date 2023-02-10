'use strict';

const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var VentaSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.ObjectId, ref: 'cliente', required: true },
  nventa: { type: String, required: true },
  envio_titulo: { type: String, required: true },
  envio_precio: { type: Number, required: true },
  transaccion: { type: String, required: true },
  cupon: { type: String, required: false },
  estado: { type: String, required: true },
  direccion: { type: mongoose.Schema.ObjectId, ref: 'direccion', required: true },
  estado: { type: String, required: true },
  nota: { type: String, required: false },
  subtotal: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now(), required: true },
});

//Export the model
module.exports = mongoose.model('venta', VentaSchema);
