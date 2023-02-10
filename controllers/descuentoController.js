const Descuento = require('../models/descuento');
const path = require('path');
const fs = require('fs');

const registro_descuento_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role == 'admin') {
      try {
        const data = req.body;
        let img_path = req.files.banner.path;
        let name = img_path.split('\\');
        let banner_name = name[2];

        data.banner = banner_name;
        const reg = await Descuento.create(data);

        res.status(200).send({ data: reg });
      } catch (error) {
        res.status(500).send({ message: 'No se pudo registrar el producto', error });
      }
    } else {
      return res.status(500).send({ message: 'No Access' });
    }
  } else {
    return res.status(500).send({ message: 'No Access' });
  }
};

const get_descuento = async (req, res) => {
  if (req.user) {
    if (req.user.role == 'admin') {
      const filtro = req.params['filtro'];

      if (filtro == null || filtro == 'null') {
        const reg = await Descuento.find().sort({
          createdAt: -1,
        });
        res.status(200).send({ data: reg });
      } else {
        const reg = await Descuento.find({ titulo: new RegExp(filtro, 'i') }).sort({
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

const get_banner = (req, res) => {
  const img = req.params['img'];

  fs.stat('./uploads/descuentos/' + img, (err) => {
    if (!err) {
      let path_img = './uploads/descuentos/' + img;
      res.status(200).sendFile(path.resolve(path_img));
    } else {
      let path_img = './uploads/productos/default.jpg';
      res.status(200).sendFile(path.resolve(path_img));
    }
  });
};

const get_descuento_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role === 'admin') {
      const id = req.params['id'];

      try {
        const reg = await Descuento.findById({ _id: id });

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

const actualizar_descuento_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role == 'admin') {
      try {
        const id = req.params['id'];
        const data = req.body;
        if (req.files) {
          let img_path = req.files.banner.path;
          let name = img_path.split('\\');
          let banner_name = name[2];

          let reg = await Descuento.findByIdAndUpdate(
            { _id: id },
            {
              titulo: data.titulo,
              descuento: data.descuento,
              fecha_inicio: data.fecha_inicio,
              fecha_fin: data.fecha_fin,
              banner: banner_name,
            }
          );
          //eliminar imagen
          fs.stat('./uploads/descuentos/' + reg.banner, (err) => {
            if (!err) {
              fs.unlink('./uploads/descuentos/' + reg.banner, (err) => {
                if (err) throw err;
              });
            }
          });
          res.status(200).send({ data: reg });
        } else {
          let reg = await Descuento.findByIdAndUpdate(
            { _id: id },
            {
              titulo: data.titulo,
              descuento: data.descuento,
              fecha_inicio: data.fecha_inicio,
              fecha_fin: data.fecha_fin,
            }
          );

          res.status(200).send({ data: reg });
        }
      } catch (error) {
        res.status(500).send({ message: 'No se pudo actualizar el producto', error });
      }
    } else {
      return res.status(500).send({ message: 'No Access' });
    }
  } else {
    return res.status(500).send({ message: 'No Access' });
  }
};

const eliminar_descuento_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role === 'admin') {
      const id = req.params.id;
      try {
        const reg = await Descuento.findByIdAndRemove({ _id: id });

        fs.stat('./uploads/productos/' + reg.portada, (err) => {
          if (!err) {
            fs.unlink('./uploads/productos/' + reg.portada, (err) => {
              if (err) throw err;
            });
          }
        });
        res.status(200).send({ data: reg });
      } catch (error) {
        return res.status(200).send({ message: 'No se pudo eliminar el cliente', error });
      }
    } else {
      return res.status(500).send({ message: 'No Access' });
    }
  } else {
    return res.status(500).send({ message: 'No Access' });
  }
};

const get_descuento_activo = async (req, res) => {
  try {
    const descuentos = await Descuento.find().sort({ createdAt: -1 });
    const today = Date.parse(new Date().toString()) / 1000;
    const arr_descuentos = [];

    descuentos.forEach((element) => {
      const tt_inicio = Date.parse(element.fecha_inicio + 'T00:00:00') / 1000;
      const tt_fin = Date.parse(element.fecha_fin + 'T23:59:59') / 1000;

      if (today >= tt_inicio && today <= tt_fin) {
        arr_descuentos.push(element);
      }
    });

    if (arr_descuentos.length >= 1) {
      res.status(200).send({ data: arr_descuentos });
    } else {
      return res.status(200).send({ data: undefined });
    }
  } catch (error) {
    return res.status(200).send({ data: undefined });
  }
};

module.exports = {
  registro_descuento_admin,
  get_descuento,
  get_banner,
  get_descuento_admin,
  actualizar_descuento_admin,
  eliminar_descuento_admin,
  get_descuento_activo,
};
