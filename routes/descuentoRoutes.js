const express = require('express');
const {
  registro_descuento_admin,
  get_descuento,
  get_banner,
  get_descuento_admin,
  actualizar_descuento_admin,
  eliminar_descuento_admin,
  get_descuento_activo,
} = require('../controllers/descuentoController');

const { auth } = require('../middlewares/authenticate');
const api = express.Router();
const multiparty = require('connect-multiparty');
let path = multiparty({ uploadDir: './uploads/descuentos' });

api.post('/registro_descuento_admin', [auth, path], registro_descuento_admin);
api.get('/get_banner/:img?', get_banner);
api.get('/get_descuento/:filtro?', auth, get_descuento);
api.get('/get_descuento_admin/:id?', auth, get_descuento_admin);
api.get('/get_descuento_activo/', get_descuento_activo);
api.put('/actualizar_descuento_admin/:id?', [auth, path], actualizar_descuento_admin);
api.delete('/eliminar_descuento_admin/:id', auth, eliminar_descuento_admin);

module.exports = api;
