const path = require('path');
const Producto = require('../models/productos');
const Inventario = require('../models/inventario');
const Review = require('../models/review');
const fs = require('fs');

const registro_producto_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role == 'admin') {
      try {
        const data = req.body;

        let img_path = req.files.portada.path;
        let name = img_path.split('\\');
        let portada_name = name[2];

        data.slug = data.titulo
          .toLowerCase()
          .replace(/ /g, '-')
          .replace(/[^\w-]+/g, '');

        data.portada = portada_name;

        const reg = await Producto.create(data);

        const inventario = await Inventario.create({
          admin: req.user.sub,
          cantidad: data.stock,
          proveedor: 'Primer registro',
          producto: reg._id,
        });

        res.status(200).send({ data: reg, inventario: inventario });
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

const get_producto = async (req, res) => {
  if (req.user) {
    if (req.user.role == 'admin') {
      const filtro = req.params['filtro'];

      if (filtro == null || filtro == 'null') {
        const reg = await Producto.find().sort({
          createdAt: -1,
        });
        res.status(200).send({ data: reg });
      } else {
        const reg = await Producto.find({ titulo: new RegExp(filtro, 'i') }).sort({
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

const get_portada_admin = (req, res) => {
  const img = req.params['img'];

  fs.stat('./uploads/productos/' + img, (err) => {
    if (!err) {
      let path_img = './uploads/productos/' + img;
      res.status(200).sendFile(path.resolve(path_img));
    } else {
      let path_img = './uploads/productos/default.jpg';
      res.status(200).sendFile(path.resolve(path_img));
    }
  });
};

const get_producto_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role === 'admin') {
      const id = req.params['id'];

      try {
        const reg = await Producto.findById({ _id: id });

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

const actualizar_producto_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role == 'admin') {
      try {
        const id = req.params['id'];
        const data = req.body;

        if (req.files) {
          let img_path = req.files.portada.path;
          let name = img_path.split('\\');
          let portada_name = name[2];
          let reg = await Producto.findByIdAndUpdate(
            { _id: id },
            {
              titulo: data.titulo,
              stock: data.stock,
              descripcion: data.descripcion,
              contenido: data.contenido,
              categoria: data.categoria,
              precio: data.precio,
              portada: portada_name,
              caracteristicas: data.caracteristicas,
            }
          );
          //eliminar imagen
          fs.stat('./uploads/productos/' + reg.portada, (err) => {
            if (!err) {
              fs.unlink('./uploads/productos/' + reg.portada, (err) => {
                if (err) throw err;
              });
            }
          });
          res.status(200).send({ data: reg });
        } else {
          let reg = await Producto.findByIdAndUpdate(
            { _id: id },
            {
              titulo: data.titulo,
              stock: data.stock,
              descripcion: data.descripcion,
              contenido: data.contenido,
              categoria: data.categoria,
              precio: data.precio,
              caracteristicas: data.caracteristicas,
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

const eliminar_producto_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role === 'admin') {
      const id = req.params.id;
      try {
        const reg = await Producto.findByIdAndRemove({ _id: id });

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

const listar_inventario_producto_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role === 'admin') {
      const id = req.params.id;

      const reg = await Inventario.find({ producto: id })
        .populate('admin')
        .populate('producto')
        .sort({ createdAt: -1 });

      res.status(200).send({ data: reg });
    } else {
      return res.status(500).send({ message: 'No Access' });
    }
  } else {
    return res.status(500).send({ message: 'No Access' });
  }
};

const Eliminar_inventario_producto_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role === 'admin') {
      try {
        const id = req.params.id;

        const reg = await Inventario.findByIdAndDelete({ _id: id });

        // obtener el registro del producto
        const prod = await Producto.findById({ _id: reg.producto });

        let nuevoStock = parseInt(prod.stock) - parseInt(reg.cantidad);

        const producto = await Producto.findByIdAndUpdate({ _id: reg.producto }, { stock: nuevoStock });
        res.status(200).send({ data: producto });
      } catch (error) {
        res.status(500).send({ message: 'No se pudo eliminar el stock del producto', error });
      }
    } else {
      return res.status(500).send({ message: 'No Access' });
    }
  } else {
    return res.status(500).send({ message: 'No Access' });
  }
};

const registro_inventario_producto_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role == 'admin') {
      try {
        const data = req.body;

        const reg = await Inventario.create(data);

        const prod = await Producto.findById({ _id: reg.producto });

        let nuevoStock = parseInt(prod.stock) + parseInt(reg.cantidad);

        const producto = await Producto.findByIdAndUpdate({ _id: reg.producto }, { stock: nuevoStock });

        res.status(200).send({ data: reg });
      } catch (error) {
        res.status(500).send({ message: 'No se pudo registrar el stock del producto', error });
      }
    } else {
      return res.status(500).send({ message: 'No Access' });
    }
  } else {
    return res.status(500).send({ message: 'No Access' });
  }
};

const actualizar_producto_caracteristicas_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role == 'admin') {
      try {
        const id = req.params['id'];
        const data = req.body;

        let reg = await Producto.findByIdAndUpdate(
          { _id: id },
          {
            caracteristicas: data.caracteristicas,
            titulo_caracte: data.titulo_caracte,
          }
        );

        res.status(200).send({ data: reg });
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
const agregar_galeria_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role == 'admin') {
      try {
        const id = req.params['id'];
        const data = req.body;

        let img_path = req.files.imagen.path;
        let name = img_path.split('\\');
        let imagen_name = name[2];
        console.log(req.body);
        const reg = await Producto.findByIdAndUpdate(
          { _id: id },
          {
            $push: {
              galeria: {
                imagen: imagen_name,
                _id: data.titulo,
              },
            },
          }
        );

        res.status(200).send({ data: reg });
      } catch (error) {
        res.status(500).send({ message: 'No se pudo agregar la imagen', error });
      }
    } else {
      return res.status(500).send({ message: 'No Access' });
    }
  } else {
    return res.status(500).send({ message: 'No Access' });
  }
};

const eliminar_galeria_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role == 'admin') {
      try {
        const id = req.params['id'];
        const data = req.body;

        const reg = await Producto.findByIdAndUpdate({ _id: id }, { $pull: { galeria: { _id: data._id } } });

        res.status(200).send({ data: reg });
      } catch (error) {
        res.status(500).send({ message: 'No se pudo eliminar la imagen', error });
      }
    } else {
      return res.status(500).send({ message: 'No Access' });
    }
  } else {
    return res.status(500).send({ message: 'No Access' });
  }
};

// metodos publicos

const get_producto_publico = async (req, res) => {
  const filtro = req.params['filtro'];

  const reg = await Producto.find({ titulo: new RegExp(filtro, 'i') }).sort({ createdAt: -1 });
  res.status(200).send({ data: reg });
};

const get_producto_slug_publico = async (req, res) => {
  const slug = req.params['slug'];

  const reg = await Producto.findOne({ slug: slug });
  res.status(200).send({ data: reg });
};

const get_producto_recomendados_publico = async (req, res) => {
  const categoria = req.params['categoria'];

  const reg = await Producto.find({ categoria: categoria }).sort({ createdAt: -1 }).limit(8);
  res.status(200).send({ data: reg });
};

const get_producto_new_publico = async (req, res) => {
  const reg = await Producto.find().sort({ createdAt: -1 }).limit(8);
  res.status(200).send({ data: reg });
};

const get_producto_masvendidos_publico = async (req, res) => {
  const reg = await Producto.find().sort({ nventas: -1 }).limit(8);
  res.status(200).send({ data: reg });
};

const get_review_producto_publico = async (req, res) => {
  try {
    let id = req.params['id'];
    let reg = await Review.find({ producto: id }).sort({ createAt: -1 }).populate('cliente');

    res.status(200).send({ data: reg });
  } catch (error) {
    res.status(500).send({ message: 'No se encontro la review', error });
  }
};

module.exports = {
  registro_producto_admin,
  get_producto,
  get_portada_admin,
  get_producto_admin,
  actualizar_producto_admin,
  eliminar_producto_admin,
  listar_inventario_producto_admin,
  Eliminar_inventario_producto_admin,
  registro_inventario_producto_admin,
  actualizar_producto_caracteristicas_admin,
  agregar_galeria_admin,
  eliminar_galeria_admin,
  get_producto_publico,
  get_producto_slug_publico,
  get_producto_recomendados_publico,
  get_producto_new_publico,
  get_producto_masvendidos_publico,
  get_review_producto_publico,
};
