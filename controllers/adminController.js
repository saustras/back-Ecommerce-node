const admin = require('../models/admin');
const Venta = require('../models/venta');
const Dventa = require('../models/dventa');
const brcrypt = require('bcrypt-nodejs');
const jwt = require('../helpers/jwt');

const registro_admin = async (req, res) => {
  try {
    const data = req.body;
    let adminArr = await admin.find({ email: data.email });

    if (adminArr.length > 0) {
      res.status(200).send({ message: 'El email ya existe', data: undefined });
    } else {
      if (data.password) {
        brcrypt.hash(data.password, null, null, async (err, hash) => {
          if (err) {
            res.status(500).send({
              message: 'Error al encriptar la contraseña',
              data: undefined,
            });
          } else {
            data.password = hash;
            const reg = await admin.create(data);
            if (!reg) {
              res.status(500).send({
                message: 'Error al crear el admin',
                data: undefined,
              });
            } else {
              res.status(200).send({ message: 'admin registrado', data: reg });
            }
          }
        });
      }
    }
  } catch (error) {
    res.status(500).send({ message: 'No pudo ser registrado' });
  }
};
const getAdminUser = async (req, res) => {
  if (req.user) {
    const id = req.params['id'];
    try {
      const reg = await admin.findById({ _id: id });
      res.status(200).send({ data: reg });
    } catch (error) {
      return res.status(200).send({ data: undefined });
    }
  } else {
    return res.status(500).send({ message: 'No Access' });
  }
};

const getAdmin = async (req, res) => {
  const reg = await admin.find();
  res.status(200).send({ reg });
};

const login_admin = async (req, res) => {
  try {
    const data = req.body;
    let adminArr = await admin.find({ email: data.email });
    const user = adminArr[0];

    if (adminArr.length > 0) {
      brcrypt.compare(data.password, user.password, async (err, check) => {
        check
          ? res.status(200).send({ data: user, token: jwt.createToken(user) })
          : res.status(200).send({
              message: 'Contraseña incorrecta',
              data: undefined,
            });
      });
    } else if (adminArr.length === 0) {
      res.status(200).send({
        message: 'El email no existe',
        data: undefined,
      });
    }
  } catch (error) {
    res.status(500).send({ message: 'No se pudo ingresar' });
  }
};

const get_ventas_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role == 'admin') {
      try {
        let ventas = [];
        const desde = req.params['desde'];
        const hasta = req.params['hasta'];

        if (desde == 'undefined' && hasta == 'undefined') {
          ventas = await Venta.find().populate('cliente').populate('direccion').sort({ createdAt: -1 });
          return res.status(200).send({ data: ventas });
        } else {
          let tt_desde = Date.parse(new Date(desde + 'T00:00:00')) / 1000;
          let tt_hasta = Date.parse(new Date(hasta + 'T00:00:00')) / 1000;

          let temp_ventas = await Venta.find().populate('cliente').populate('direccion').sort({ createdAt: -1 });

          for (let item of temp_ventas) {
            let tt_venta = Date.parse(new Date(item.createdAt)) / 1000;

            if (tt_venta >= tt_desde && tt_venta <= tt_hasta) {
              ventas.push(item);
            }
          }
          return res.status(200).send({ data: ventas });
        }
      } catch (error) {
        return res.status(500).send({ message: 'no se pudieron encontrar las ventas', error });
      }
    } else {
      return res.status(500).send({ message: 'No Access' });
    }
  } else {
    return res.status(500).send({ message: 'No Access' });
  }
};

//kpi

const ganancias_mensuales_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role == 'admin') {
      try {
        let enero = 0;
        let febrero = 0;
        let marzo = 0;
        let abril = 0;
        let mayo = 0;
        let junio = 0;
        let julio = 0;
        let agosto = 0;
        let septiembre = 0;
        let octubre = 0;
        let novimebre = 0;
        let diciembre = 0;

        const ventas = await Venta.find();
        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth() + 1;

        let totalGanancias = 0;
        let totalMes = 0;
        let countVentas = 0;
        let totalMesAnterior = 0;

        for (const item of ventas) {
          let createdAt_date = new Date(item.createdAt);
          let mes = createdAt_date.getMonth() + 1;

          if (createdAt_date.getFullYear() == currentYear) {
            totalGanancias = totalGanancias + item.subtotal;

            if (mes == currentMonth) {
              totalMes += item.subtotal;
              countVentas = countVentas + 1;
            }

            if (mes == currentMonth - 1) {
              totalMesAnterior += item.subtotal;
            }

            if (mes == 1) {
              enero += item.subtotal;
            }
            if (mes == 2) {
              febrero += item.subtotal;
            }
            if (mes == 3) {
              marzo += item.subtotal;
            }
            if (mes == 4) {
              abril += item.subtotal;
            }
            if (mes == 5) {
              mayo += item.subtotal;
            }
            if (mes == 6) {
              junio += item.subtotal;
            }
            if (mes == 7) {
              julio += item.subtotal;
            }
            if (mes == 8) {
              agosto += item.subtotal;
            }
            if (mes == 9) {
              septiembre += item.subtotal;
            }
            if (mes == 10) {
              octubre += item.subtotal;
            }
            if (mes == 11) {
              noviembre += item.subtotal;
            }
            if (mes == 12) {
              diciembre += item.subtotal;
            }
          }
        }

        return res.status(200).send({
          enero,
          febrero,
          marzo,
          abril,
          mayo,
          junio,
          julio,
          agosto,
          septiembre,
          octubre,
          novimebre,
          diciembre,
          totalGanancias,
          totalMes,
          countVentas,
          totalMesAnterior,
        });
      } catch (error) {
        return res.status(500).send({ message: 'no se pudieron encontrar las ventas', error });
      }
    } else {
      return res.status(500).send({ message: 'No Access' });
    }
  } else {
    return res.status(500).send({ message: 'No Access' });
  }
};

module.exports = {
  registro_admin,
  getAdmin,
  login_admin,
  getAdminUser,
  get_ventas_admin,
  ganancias_mensuales_admin,
};
