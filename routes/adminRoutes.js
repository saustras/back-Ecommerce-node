const express = require('express');
const { getAdmin, login_admin, getAdminUser, get_ventas_admin, ganancias_mensuales_admin } = require('../controllers/adminController');

const { auth } = require('../middlewares/authenticate');

const api = express.Router();

api.get('/get_admins', getAdmin);
api.get('/getAdminUser/:id', auth, getAdminUser);
api.get('/get_ventas_admin/:desde?/:hasta?', auth, get_ventas_admin);
api.get('/ganancias_mensuales_admin/', auth, ganancias_mensuales_admin);
api.post('/login_admin', login_admin);

module.exports = api;
