const express = require('express');
const {
  registro_producto_admin,
  get_producto,
  get_portada_admin,
  get_producto_admin,
  actualizar_producto_admin,
  eliminar_producto_admin,
  listar_inventario_producto_admin,
  Eliminar_inventario_producto_admin,
  registro_inventario_producto_admin,
  actualizar_producto_caracteristicas_admin,
  agregar_galeria_admin,
  eliminar_galeria_admin,
  get_producto_publico,
  get_producto_slug_publico,
  get_producto_recomendados_publico,
  get_producto_new_publico,
  get_producto_masvendidos_publico,
  get_review_producto_publico,
} = require('../controllers/productosController');

const { auth } = require('../middlewares/authenticate');
const api = express.Router();
const multiparty = require('connect-multiparty');
let path = multiparty({ uploadDir: './uploads/productos' });

//Productos
api.post('/registro_producto_admin', [auth, path], registro_producto_admin);
api.get('/get_producto/:filtro?', auth, get_producto);
api.get('/get_portada_admin/:img?', get_portada_admin);
api.get('/get_producto_admin/:id', auth, get_producto_admin);
api.delete('/eliminar_producto_admin/:id', auth, eliminar_producto_admin);
api.put('/actualizar_producto_admin/:id', [auth, path], actualizar_producto_admin);
api.put('/agregar_galeria_admin/:id', [auth, path], agregar_galeria_admin);
api.put('/eliminar_galeria_admin/:id', auth, eliminar_galeria_admin);

api.put('/actualizar_producto_caracteristicas_admin/:id',auth,actualizar_producto_caracteristicas_admin);

//inventarios
api.get('/listar_inventario_producto_admin/:id', auth, listar_inventario_producto_admin);
api.delete('/Eliminar_inventario_producto_admin/:id', auth, Eliminar_inventario_producto_admin);
api.post('/registro_inventario_producto_admin', auth, registro_inventario_producto_admin);

//publico
api.get('/get_producto_publico/:filtro?', get_producto_publico);
api.get('/get_producto_slug_publico/:slug', get_producto_slug_publico);
api.get('/get_producto_recomendados_publico/:categoria', get_producto_recomendados_publico);
api.get('/get_producto_new_publico', get_producto_new_publico);
api.get('/get_producto_masvendidos_publico', get_producto_masvendidos_publico);
api.get('/get_review_producto_publico/:id', get_review_producto_publico);

module.exports = api;
