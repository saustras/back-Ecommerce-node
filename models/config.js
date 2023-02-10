'use strict';

const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var ConfigSchema = new mongoose.Schema({
  categorias: [{ type: Object, required: true }],
  titulo: { type: String, required: true },
  logo: { type: String, required: true },
  serie: { type: String, required: true },
  correlativo: { type: String, required: false },
});

//Export the model
module.exports = mongoose.model('config', ConfigSchema);
