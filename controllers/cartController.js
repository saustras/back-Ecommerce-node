const Cart = require('../models/cart.js');

const agregar_cart_cliente = async (req, res) => {
  if (req.user) {
    const data = req.body;

    const cart_cliente = await Cart.find({ cliente: data.cliente, producto: data.producto });

    if (cart_cliente.length === 0) {
      const reg = await Cart.create(data);
      res.status(200).send({ data: reg });
    } else {
      res.status(200).send({ data: undefined });
    }
  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
};

const get_cart_cliente = async (req, res) => {
  if (req.user) {
    const id = req.params['id'];

    const cart_cliente = await Cart.find({ cliente: id }).populate('producto');

    res.status(200).send({ data: cart_cliente });
  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
};

const eliminar_cart_cliente = async (req, res) => {
  if (req.user) {
    const id = req.params['id'];
    const reg = await Cart.findByIdAndRemove({ _id: id });

    res.status(200).send({ data: reg });
  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
};

module.exports = {
  agregar_cart_cliente,
  get_cart_cliente,
  eliminar_cart_cliente,
};
