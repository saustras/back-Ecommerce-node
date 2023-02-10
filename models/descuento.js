'use strict';

const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var DescuentoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  banner: { type: String, required: true },
  descuento: { type: Number, required: true },
  fecha_inicio: { type: String, required: true },
  fecha_fin: { type: String, required: true },
  createdAt: { type: Number, default: Date.now(), required: true },
});

//Export the model
module.exports = mongoose.model('descuento', DescuentoSchema);
