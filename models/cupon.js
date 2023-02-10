'use strict';

const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var CuponSchema = new mongoose.Schema({
  valor: { type: Number, required: true },
  limite: { type: Number, required: true },
  codigo: { type: String, required: true },
  tipo: { type: String, required: true },
  createdAt: { type: Date, default: Date.now(), required: true },
});

//Export the model
module.exports = mongoose.model('cupon', CuponSchema);
