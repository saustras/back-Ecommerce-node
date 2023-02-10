const express = require('express');
const {
  cupon_registro_admin,
  get_cupon,
  eliminar_cupon_admin,
  get_cupon_admin,
  actualizar_cupon_admin,
  validar_cupon,
} = require('../controllers/cuponController');

const { auth } = require('../middlewares/authenticate');

const api = express.Router();

api.post('/cupon_registro_admin', auth, cupon_registro_admin);
api.delete('/eliminar_cupon_admin/:id', auth, eliminar_cupon_admin);
api.get('/get_cupon_admin/:id', auth, get_cupon_admin);
api.put('/actualizar_cupon_admin/:id', auth, actualizar_cupon_admin);
api.get('/get_cupon/:filtro?', auth, get_cupon);
api.get('/validar_cupon/:cupon', auth, validar_cupon);

module.exports = api;
