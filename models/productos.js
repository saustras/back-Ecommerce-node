'use strict';

const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  slug: { type: String, required: true },
  galeria: [{ type: Object, required: false }],
  portada: { type: String, required: true },
  precio: { type: Number, required: true },
  descripcion: { type: String, required: true },
  stock: { type: Number, required: true },
  nventas: { type: Number, default: 0, required: true },
  npuntos: { type: Number, default: 0, required: true },
  categoria: { type: String, default: 0, required: false },
  estado: { type: String, default: 'Edicion', required: true },
  caracteristicas: [{ type: Object, required: false }],
  titulo_caracte: { type: String, required: false },
  contenido: { type: String, required: false },
  createdAt: { type: Date, default: Date.now(), required: true },
});

//Export the model
module.exports = mongoose.model('producto', productoSchema);
