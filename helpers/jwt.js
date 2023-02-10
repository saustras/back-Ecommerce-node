'use strict';

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'federendon';

exports.createToken = (user) => {
  const payload = {
    sub: user._id,
    nombre: user.nombre,
    apellido: user.apellido,
    email: user.email,
    role: user.rol,
    iat: moment().unix(),
    exp: moment().add(7, 'days').unix(),
  };

  return jwt.encode(payload, secret);
};
