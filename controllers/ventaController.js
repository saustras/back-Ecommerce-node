const Venta = require('../models/venta');
const Dventa = require('../models/dventa');
const Producto = require('../models/productos');
const Cart = require('../models/cart');
const Config = require('../models/config');
var fs = require('fs');
var handlebars = require('handlebars');
var ejs = require('ejs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var path = require('path');
const { config } = require('process');

const registro_compra_cliente = async (req, res) => {
  if (req.user) {
    try {
      const data = req.body;
      const detalles = data.detalles;

      const venta_last = await Venta.find().sort({ createdAt: -1 });
      let serie;
      let correlativo;
      let n_venta;

      if (venta_last.length == 0) {
        serie = '001';
        correlativo = '000001';
        n_venta = serie + '-' + correlativo;
      } else {
        let lastVenta = venta_last[0].nventa;
        const arr_venta = lastVenta.split('-');

        if (arr_venta[1] != '999999') {
          const new_correlativo = zfill(parseInt(arr_venta[1]) + 1, 6);
          n_venta = arr_venta[0] + '-' + new_correlativo;
        } else if (arr_venta[1] == '999999') {
          const newSerie = zfill(parseInt(arr_venta[0]) + 1, 3);
          n_venta = newSerie + '-' + '000001';
        }
      }

      data.nventa = n_venta;
      data.estado = 'Procesando';

      let venta = await Venta.create(data);

      detalles.forEach(async (element) => {
        try {
          element.venta = venta._id;
          await Dventa.create(element);

          let producto = await Producto.findById({ _id: element.producto });
          let newStock = producto.stock - element.cantidad;

          await Producto.findByIdAndUpdate(
            { _id: element.producto },
            {
              stock: newStock,
            }
          );

          await Cart.remove({ cliente: data.cliente });
        } catch (error) {
          res.status(500).send({ message: 'No se pudo registrar la venta', error });
        }
      });

      res.status(200).send({ venta: venta });
    } catch (error) {
      res.status(500).send({ message: 'No se pudo registrar la venta', error });
    }
  } else {
    return res.status(500).send({ message: 'No Access' });
  }
};

function zfill(number, width) {
  var numberOutput = Math.abs(number);
  var length = number.toString().length;
  var zero = '0';

  if (width <= length) {
    if (number < 0) {
      return '-' + numberOutput.toString();
    } else {
      return numberOutput.toString();
    }
  } else {
    if (number < 0) {
      return '-' + zero.repeat(width - length) + numberOutput.toString();
    } else {
      return zero.repeat(width - length) + numberOutput.toString();
    }
  }
}

const enviar_correo_compra_cliente = async (req, res) => {
  try {
    const id = req.params['id'];

    var readHTMLFile = function (path, callback) {
      fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
          throw err;
          callback(err);
        } else {
          callback(null, html);
        }
      });
    };
    var transporter = nodemailer.createTransport(
      smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
          user: 'fede.saus26@gmail.com',
          pass: 'qjrgctpobxwexkic',
        },
      })
    );

    const venta = await Venta.findById({ _id: id }).populate('cliente');
    const detalles = await Dventa.find({ venta: id }).populate('producto');
    const config = await Config.findOne();

    const cliente = venta.cliente.nombre + ' ' + venta.cliente.apellidos;
    const _id = venta._id;
    const fecha = new Date(venta.createdAt);
    const data = detalles;
    const subtotal = separator(venta.subtotal);
    const precio_envio = separator(venta.envio_precio);
    const tienda = config.titulo;
    const logo = config.logo;

    data.forEach((producto) => {
      producto.subtotal = separator(producto.subtotal);
    });

    readHTMLFile(process.cwd() + '/mail.html', (err, html) => {
      let rest_html = ejs.render(html, { data, cliente, _id, fecha, subtotal, precio_envio, tienda, logo });

      var template = handlebars.compile(rest_html);
      var htmlToSend = template({ op: true });
      var mailOptions = {
        from: 'fede.saus26@gmail.com',
        to: venta.cliente.email,
        subject: 'Gracias por tu compra, ' + tienda,
        html: htmlToSend,
      };
      res.status(200).send({ data: true });
      transporter.sendMail(mailOptions, function (error, info) {
        if (!error) {
          console.log('Email sent: ' + info.response);
        }
      });
    });
  } catch (error) {
    res.status(500).send({ message: 'No se pudo enviar el correo', error });
  }
};

function separator(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

module.exports = {
  registro_compra_cliente,
  enviar_correo_compra_cliente,
};
