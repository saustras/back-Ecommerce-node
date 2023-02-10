const express = require('express');
const {
  actualizar_config_admin,
  get_config_admin,
  get_logo_admin,
  get_config_public,
} = require('../controllers/configControllers');

const { auth } = require('../middlewares/authenticate');

const api = express.Router();
const multiparty = require('connect-multiparty');
let path = multiparty({ uploadDir: './uploads/config' });

api.put('/actualizar_config_admin/:id', [auth, path], actualizar_config_admin);
api.get('/get_config_admin', auth, get_config_admin);
api.get('/get_logo_admin/:img', get_logo_admin);
api.get('/get_config_public', get_config_public);

module.exports = api;
