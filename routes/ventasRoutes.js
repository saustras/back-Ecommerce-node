const express = require('express');

const { auth } = require('../middlewares/authenticate');
const { registro_compra_cliente, enviar_correo_compra_cliente } = require('../controllers/ventaController');

const api = express.Router();

api.post('/registro_compra_cliente', auth, registro_compra_cliente);
api.get('/enviar_correo_compra_cliente/:id', auth, enviar_correo_compra_cliente);

module.exports = api;
