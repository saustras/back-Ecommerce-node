const Cliente = require('../models/cliente');
const Venta = require('../models/venta');
const Dventa = require('../models/dventa');
const Direccion = require('../models/direccion');
const Review = require('../models/review');
const brcrypt = require('bcrypt-nodejs');
const jwt = require('../helpers/jwt');

const registro_cliente = async (req, res) => {
  try {
    const data = req.body;
    let clienteArr = await Cliente.find({ email: data.email });

    if (clienteArr.length > 0) {
      res.status(200).send({ message: 'El email ya existe', data: undefined });
    } else {
      if (data.password) {
        brcrypt.hash(data.password, null, null, async (err, hash) => {
          err
            ? res.status(500).send({
                message: 'Error al encriptar la contraseña',
                data: undefined,
              })
            : (data.password = hash);
          const reg = await Cliente.create(data);
          reg
            ? res.status(200).send({ message: 'El cliente se ha registrado correctamente', data: reg })
            : res.status(500).send({
                message: 'Error al crear el cliente',
                data: undefined,
              });
        });
      }
    }
  } catch (error) {
    res.status(500).send({ message: 'Error al registrar cliente', data: error });
  }
};

const get_cliente = async (req, res) => {
  if (req.user) {
    if (req.user.role === 'admin') {
      let tipo = req.params['tipo'];
      let filtro = req.params['filtro'];

      if (tipo === null || tipo === 'null') {
        const reg = await Cliente.find().sort({
          createdAt: -1,
        });
        res.status(200).send({ data: reg });
      } else {
        if (tipo === 'apellidos') {
          let reg = await Cliente.find({
            apellidos: new RegExp(filtro, 'i'),
          }).sort({
            createdAt: -1,
          });
          res.status(200).send({ data: reg });
        } else if (tipo === 'correo') {
          let reg = await Cliente.find({ email: new RegExp(filtro, 'i') }).sort({
            createdAt: -1,
          });
          res.status(200).send({ data: reg });
        }
      }
    } else {
      return res.status(500).send({ message: 'No Access' });
    }
  } else {
    return res.status(500).send({ message: 'No Access' });
  }
};

const login_cliente = async (req, res) => {
  try {
    const data = req.body;
    let clienteArr = await Cliente.find({ email: data.email });
    const user = clienteArr[0];

    if (clienteArr.length > 0) {
      brcrypt.compare(data.password, user.password, async (err, check) => {
        check;
        if (err) {
          res.status(200).send({
            message: 'Contraseña incorrecta',
            data: undefined,
          });
        } else {
          res.status(200).send({ data: user, token: jwt.createToken(user) });
        }
      });
    } else {
      res.status(200).send({
        message: 'El email no existe',
        data: undefined,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const registro_cliente_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role === 'admin') {
      var data = req.body;

      brcrypt.hash('1234567', null, null, async (err, hash) => {
        if (err) {
          res.status(500).send({
            message: 'Error al encriptar la contraseña',
            data: undefined,
          });
        } else {
          data.password = hash;
        }
        const reg = await Cliente.create(data);
        if (reg) {
          res.status(200).send({ message: 'Cliente registrado', data: reg });
        } else {
          res.status(500).send({
            message: 'Error al crear el cliente',
            data: undefined,
          });
        }
      });
    } else {
      return res.status(500).send({ message: 'No Access' });
    }
  } else {
    return res.status(500).send({ message: 'No Access' });
  }
};

const get_cLient_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role === 'admin') {
      const id = req.params['id'];

      try {
        const reg = await Cliente.findById({ _id: id });
        res.status(200).send({ data: reg });
      } catch (error) {
        return res.status(200).send({ data: undefined });
      }
    } else {
      return res.status(500).send({ message: 'No Access' });
    }
  } else {
    return res.status(500).send({ message: 'No Access' });
  }
};

const actualizar_cliente_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role === 'admin') {
      const id = req.params.id;
      let data = req.body;

      const reg = await Cliente.findByIdAndUpdate(
        { _id: id },
        {
          nombre: data.nombre,
          apellidos: data.apellidos,
          email: data.email,
          telefono: data.telefono,
          f_nacimiento: data.f_nacimiento,
          dni: data.dni,
          genero: data.genero,
        }
      );
      res.status(200).send({ data: reg });
    } else {
      return res.status(500).send({ message: 'No Access' });
    }
  } else {
    return res.status(500).send({ message: 'No Access' });
  }
};

const eliminar_cliente_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role === 'admin') {
      const id = req.params.id;
      try {
        const reg = await Cliente.findByIdAndRemove({ _id: id });
        res.status(200).send({ data: reg });
      } catch (error) {
        return res.status(200).send({ message: 'No se pudo eliminar el cliente' });
      }
    } else {
      return res.status(500).send({ message: 'No Access' });
    }
  } else {
    return res.status(500).send({ message: 'No Access' });
  }
};

const get_cLient_public = async (req, res) => {
  if (req.user) {
    const id = req.params['id'];

    try {
      const reg = await Cliente.findById({ _id: id });
      res.status(200).send({ data: reg });
    } catch (error) {
      return res.status(200).send({ data: undefined });
    }
  } else {
    return res.status(500).send({ message: 'No Access' });
  }
};
const actualizar_cLient_public = async (req, res) => {
  if (req.user) {
    const id = req.params['id'];
    const data = req.body;

    try {
      if (data.password) {
        console.log('con contraseña');
        brcrypt.hash(data.password, null, null, async (err, hash) => {
          const reg = await Cliente.findById(
            { _id: id },
            {
              nombre: data.nombre,
              apellidos: data.apellidos,
              telefono: data.telefono,
              f_nacimiento: data.f_nacimiento,
              dni: data.dni,
              genero: data.genero,
              pais: data.pais,
              password: hash,
            }
          );
          res.status(200).send({ data: reg });
        });
      } else {
        console.log(data);
        const reg = await Cliente.findByIdAndUpdate(
          { _id: id },
          {
            nombre: data.nombre,
            apellidos: data.apellidos,
            telefono: data.telefono,
            f_nacimiento: data.f_nacimiento,
            dni: data.dni,
            genero: data.genero,
            pais: data.pais,
          }
        );
        res.status(200).send({ data: reg });
      }
    } catch (error) {
      return res.status(200).send({ error });
    }
  } else {
    return res.status(500).send({ message: 'No Access' });
  }
};

/* direcciones */
const direccion_registro_cliente = async (req, res) => {
  if (req.user) {
    try {
      const data = req.body;

      if (data.principal) {
        const direcciones = await Direccion.find({ cliente: data.cliente });

        for (const direccion of direcciones) {
          await Direccion.findByIdAndUpdate({ _id: direccion._id }, { principal: false });
        }
      }

      const reg = await Direccion.create(data);

      res.status(200).send({ data: reg });
    } catch (error) {
      res.status(500).send({ message: 'No se pudo registrar la direccion', error });
    }
  } else {
    return res.status(500).send({ message: 'No Access' });
  }
};
const get_direccion_all_cliente = async (req, res) => {
  if (req.user) {
    try {
      const id = req.params['id'];
      const direcciones = await Direccion.find({ cliente: id })
        .sort({ principal: -1, createdAt: -1 })
        .populate('cliente');

      res.status(200).send({ data: direcciones });
    } catch (error) {
      res.status(500).send({ message: 'No se pudo registrar la direccion', error });
    }
  } else {
    return res.status(500).send({ message: 'No Access' });
  }
};

const update_direccion_principal_cliente = async (req, res) => {
  if (req.user) {
    try {
      const id = req.params['id'];
      const cliente = req.params['cliente'];

      const direcciones = await Direccion.find({ cliente: cliente });

      for (const direccion of direcciones) {
        await Direccion.findByIdAndUpdate({ _id: direccion._id }, { principal: false });
      }

      await Direccion.findByIdAndUpdate({ _id: id }, { principal: true });

      res.status(200).send({ data: true });
    } catch (error) {
      res.status(500).send({ message: 'No se pudo registrar la direccion', error });
    }
  } else {
    return res.status(500).send({ message: 'No Access' });
  }
};

const get_direccion_principal_cliente = async (req, res) => {
  if (req.user) {
    try {
      const id = req.params['id'];
      let direccion = undefined;

      direccion = await Direccion.findOne({ cliente: id, principal: true });

      if (direccion == undefined) {
        res.status(200).send({ data: undefined });
      } else {
        res.status(200).send({ data: direccion });
      }
    } catch (error) {
      res.status(500).send({ message: 'No se pudo registrar la direccion', error });
    }
  } else {
    return res.status(500).send({ message: 'No Access' });
  }
};

//ordenes
const get_ordenes_cliente = async (req, res) => {
  if (req.user) {
    try {
      const id = req.params['id'];

      const reg = await Venta.find({ cliente: id }).sort({ createdAt: -1 });

      if (reg.length >= 1) {
        res.status(200).send({ data: reg });
      } else {
        res.status(200).send({ data: undefined });
      }
    } catch (error) {
      res.status(500).send({ message: 'No se pudo obtener la orden', error });
    }
  } else {
    return res.status(500).send({ message: 'No Access' });
  }
};

const get_detalles_orden_cliente = async (req, res) => {
  if (req.user) {
    const id = req.params['id'];
    try {
      const venta = await Venta.findById({ _id: id }).populate('direccion').populate('cliente');
      const detalles = await Dventa.find({ venta: id }).populate('producto');
      console.log(detalles);
      res.status(200).send({ data: venta, detalles: detalles });
    } catch (error) {
      res.status(200).send({ message: 'No se encontraron los detalles de la orden', data: undefined });
    }
  } else {
    return res.status(500).send({ message: 'No Access' });
  }
};

// reviews

const create_review_producto_cliente = async (req, res) => {
  if (req.user) {
    try {
      let data = req.body;

      let reg = await Review.create(data);

      res.status(200).send({ data: reg });
    } catch (error) {
      res.status(500).send({ message: 'No se pudo crear la review', error });
    }
  } else {
    return res.status(500).send({ message: 'No Access' });
  }
};

const get_review_producto_cliente = async (req, res) => {
  try {
    let id = req.params['id'];

    let reg = await Review.find({ producto: id }).sort({ createAt: -1 });

    res.status(200).send({ data: reg });
  } catch (error) {
    res.status(500).send({ message: 'No se encontro la review', error });
  }
};

const get_review_cliente = async (req, res) => {
  if (req.user) {
    try {
      let id = req.params['id'];
      let reg = await Review.find({ cliente: id }).sort({ createAt: -1 }).populate('cliente');

      res.status(200).send({ data: reg });
    } catch (error) {
      res.status(500).send({ message: 'No se encontro la review', error });
    }
  } else {
    return res.status(500).send({ message: 'No Access' });
  }
};

module.exports = {
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
};
