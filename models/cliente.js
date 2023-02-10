'use strict';

const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var clienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellidos: { type: String, required: true },
  pais: { type: String, required: false },
  email: { type: String, required: true },
  password: { type: String, required: false },
  perfil: { type: String, default: 'perfil.png', required: true },
  telefono: { type: String, required: false },
  genero: { type: String, required: false },
  f_nacimiento: { type: String, required: false },
  dni: { type: String, required: false },
  createdAt: { type: Date, default: Date.now(), required: true },
});

//Export the model
module.exports = mongoose.model('cliente', clienteSchema);
