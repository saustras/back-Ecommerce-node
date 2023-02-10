const Cupon = require('../models/cupon');

const cupon_registro_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role == 'admin') {
      try {
        const data = req.body;

        const reg = await Cupon.create(data);

        res.status(200).send({ data: reg });
      } catch (error) {
        res.status(500).send({ message: 'No se pudo registrar el cupon' });
      }
    } else {
      return res.status(500).send({ message: 'No Access' });
    }
  } else {
    return res.status(500).send({ message: 'No Access' });
  }
};

const get_cupon = async (req, res) => {
  if (req.user) {
    if (req.user.role == 'admin') {
      const filtro = req.params['filtro'];

      if (filtro == null || filtro == 'null') {
        const reg = await Cupon.find().sort({
          createdAt: -1,
        });
        res.status(200).send({ data: reg });
      } else {
        const reg = await Cupon.find({ codigo: new RegExp(filtro, 'i') }).sort({
          createdAt: -1,
        });
        res.status(200).send({ data: reg });
      }
    } else {
      return res.status(500).send({ message: 'No Access' });
    }
  } else {
    return res.status(500).send({ message: 'No Access' });
  }
};

const eliminar_cupon_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role === 'admin') {
      const id = req.params.id;
      try {
        const reg = await Cupon.findByIdAndRemove({ _id: id });
        res.status(200).send({ data: reg });
      } catch (error) {
        return res.status(200).send({ message: 'No se pudo eliminar el Cupon' });
      }
    } else {
      return res.status(500).send({ message: 'No Access' });
    }
  } else {
    return res.status(500).send({ message: 'No Access' });
  }
};

const get_cupon_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role === 'admin') {
      const id = req.params['id'];

      try {
        const reg = await Cupon.findById({ _id: id });
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

const actualizar_cupon_admin = async (req, res) => {
  if (req.user) {
    const id = req.params.id;
    let data = req.body;

    const reg = await Cupon.findByIdAndUpdate(
      { _id: id },
      {
        valor: data.valor,
        limite: data.limite,
        codigo: data.codigo,
        tipo: data.tipo,
      }
    );
    res.status(200).send({ data: reg });
  } else {
    return res.status(500).send({ message: 'No Access' });
  }
};

const validar_cupon = async (req, res) => {
  if (req.user) {
    try {
      const cupon = req.params['cupon'];

      let data = await Cupon.findOne({ codigo: cupon });

      if (data) {
        if (data.limite == 0) {
          res.status(200).send({ data: undefined });
        } else {
          res.status(200).send({ data });
        }
      } else {
        res.status(200).send({ data: undefined });
      }
    } catch (error) {
      res.status(500).send({ message: 'No se pudo registrar el cupon' });
    }
  } else {
    return res.status(500).send({ message: 'No Access' });
  }
};

module.exports = {
  cupon_registro_admin,
  get_cupon,
  eliminar_cupon_admin,
  get_cupon_admin,
  actualizar_cupon_admin,
  validar_cupon,
};
