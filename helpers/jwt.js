// Función para para generar el token y el tiempo de expiración por parametro
// Importamos jwt
const jwt = require("jsonwebtoken");
// importamos y configuramos dotenv
require("dotenv").config({ path: "../.env" });

function generateToken(data, expiresIn) {
  //return jwt.sign(data, process.env.SECRET_KEY, { expiresIn: expiresIn});
  return jwt.sign(
    data,
    process.env.SECRET_KEY,
    {
      expiresIn: expiresIn,
    }
  );
}

// Función para validar el token
function validateToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

module.exports = {
  generateToken,
  validateToken,
};
