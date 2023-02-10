const express = require('express');
const {
  registro_cliente,
  get_cliente,
  login_cliente,
  registro_cliente_admin,
  get_cLient_admin,
  actualizar_cliente_admin,
  eliminar_cliente_admin,
  get_cLient_public,
  actualizar_cLient_public,
  direccion_registro_cliente,
  get_direccion_all_cliente,
  update_direccion_principal_cliente,
  get_direccion_principal_cliente,
  get_ordenes_cliente,
  get_detalles_orden_cliente,
  create_review_producto_cliente,
  get_review_producto_cliente,
  get_review_cliente,
} = require('../controllers/clienteController');

const { auth } = require('../middlewares/authenticate');

const api = express.Router();

api.post('/registro_cliente', registro_cliente);
api.get('/get_cliente/:tipo/:filtro?', auth, get_cliente);
api.get('/get_cLient_admin/:id', auth, get_cLient_admin);
api.get('/get_cLient_public/:id', auth, get_cLient_public);
api.post('/login_cliente', login_cliente);
api.post('/registro_cliente_admin', auth, registro_cliente_admin);
api.put('/actualizar_cliente_admin/:id', auth, actualizar_cliente_admin);
api.put('/actualizar_cLient_public/:id', auth, actualizar_cLient_public);
api.delete('/eliminar_cliente_admin/:id', auth, eliminar_cliente_admin);

//direcciones
api.post('/direccion_registro_cliente', auth, direccion_registro_cliente);
api.get('/get_direccion_all_cliente/:id', auth, get_direccion_all_cliente);
api.get('/get_direccion_principal_cliente/:id', auth, get_direccion_principal_cliente);
api.put('/update_direccion_principal_cliente/:id/:cliente', auth, update_direccion_principal_cliente);

//ordenes
api.get('/get_ordenes_cliente/:id', auth, get_ordenes_cliente);
api.get('/get_detalles_orden_cliente/:id', auth, get_detalles_orden_cliente);

//review
api.post('/create_review_producto_cliente', auth, create_review_producto_cliente);
api.get('/get_review_producto_cliente/:id', get_review_producto_cliente);
api.get('/get_review_cliente/:id',auth, get_review_cliente);

api.get('/', (req,res)=>{
  res.status(200).send({ message: 'Funcionando' });
})

module.exports = api;
