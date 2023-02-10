const Config = require('../models/config');
const fs = require('fs');
const path = require('path');

const actualizar_config_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role === 'admin') {
      const data = req.body;

      if (req.files) {
        let img_path = req.files.logo.path;
        let name = img_path.split('\\');
        let logo_name = name[2];
        let reg = await Config.findByIdAndUpdate(
          { _id: '63bb5b554d332db8dbd2d6b6' },
          {
            titulo: data.titulo,
            categorias: JSON.parse(data.categorias),
            serie: data.serie,
            correlativo: data.correlativo,
            logo: logo_name,
          }
        );
        //eliminar imagen
        fs.stat('./uploads/config/' + reg.logo, (err) => {
          if (!err) {
            fs.unlink('./uploads/config/' + reg.logo, (err) => {
              if (err) throw err;
            });
          }
        });

        res.status(200).send({ data: reg });
      } else {
        let reg = await Config.findByIdAndUpdate(
          { _id: '63bb5b554d332db8dbd2d6b6' },
          {
            titulo: data.titulo,
            categorias: data.categorias,
            serie: data.serie,
            correlativo: data.correlativo,
          }
        );
        res.status(200).send({ data: reg });
      }
    } else {
      return res.status(500).send({ message: 'No Access' });
    }
  } else {
    return res.status(500).send({ message: 'No Access' });
  }
};

const get_config_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role === 'admin') {
      try {
        const reg = await Config.find();

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
const get_logo_admin = (req, res) => {
  const img = req.params['img'];

  fs.stat('./uploads/config/' + img, (err) => {
    if (!err) {
      let path_img = './uploads/config/' + img;
      res.status(200).sendFile(path.resolve(path_img));
    }
  });
};

const get_config_public = async (req, res) => {
  try {
    const reg = await Config.findById({ _id: '63bb5b554d332db8dbd2d6b6' });

    res.status(200).send({ data: reg });
  } catch (error) {
    return res.status(200).send({ data: undefined });
  }
};

module.exports = {
  actualizar_config_admin,
  get_config_admin,
  get_logo_admin,
  get_config_public,
};
