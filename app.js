'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./database/database.connection');
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 4300; // set port
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: { origin: '*' },
});

io.on('connection', (socket) => {
  socket.on('delete-cart', (data) => {
    io.emit('new-cart', data);
  });

  socket.on('agregarCarro', (data) => {
    io.emit('new-cart-add', data);
  });
});

// routes
const cliente_routes = require('./routes/clienteRoutes');
const admin_routes = require('./routes/adminRoutes');
const productos_routes = require('./routes/productosRoutes');
const cupon_routes = require('./routes/cuponRoutes');
const config_routes = require('./routes/configRoutes');
const cart_routes = require('./routes/cartRoutes');
const descuento_routes = require('./routes/descuentoRoutes');
const ventas_routes = require('./routes/ventasRoutes');

//cors
app.use(cors());

//db connection
connectDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));

//server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.use('/api', cliente_routes);
app.use('/api', admin_routes);
app.use('/api', productos_routes);
app.use('/api', cupon_routes);
app.use('/api', config_routes);
app.use('/api', cart_routes);
app.use('/api', descuento_routes);
app.use('/api', ventas_routes);

module.exports = app;
