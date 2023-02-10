'use strict';

const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var AdminSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellidos: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  telefono: { type: String, required: false },
  rol: { type: String, default: 'admin', required: false },
  dni: { type: String, required: false },
});

//Export the model
module.exports = mongoose.model('admin', AdminSchema);
