'use strict';

const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var DireccionSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.ObjectId, ref: 'cliente', required: true },
  destinatario: { type: String, required: true },
  dni: { type: String, required: true },
  zip: { type: String, required: true },
  direccion: { type: String, required: true },
  departamento: { type: String, required: true },
  ciudad: { type: String, required: true },
  telefono: { type: String, required: true },
  principal: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now(), required: true },
});

//Export the model
module.exports = mongoose.model('direccion', DireccionSchema);
