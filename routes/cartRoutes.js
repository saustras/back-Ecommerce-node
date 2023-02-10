const express = require('express');
const {
  agregar_cart_cliente,
  get_cart_cliente,
  eliminar_cart_cliente,
} = require('../controllers/cartController');

const { auth } = require('../middlewares/authenticate');

const api = express.Router();

api.post('/agregar_cart_cliente', auth, agregar_cart_cliente);
api.get('/get_cart_cliente/:id', auth, get_cart_cliente);
api.delete('/eliminar_cart_cliente/:id', auth, eliminar_cart_cliente);

module.exports = api;
