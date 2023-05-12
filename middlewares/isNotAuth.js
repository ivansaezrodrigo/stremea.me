// Middleware para comprobar si el usuario está autenticado

// Importamos el modelo de usuario
const modeloUser = require("../models").User;

// Importamos jwt
const jwt = require("jsonwebtoken");

// Si el usuario está autenticado redirigimos al index
const isNotAuth = async (req, res, next) => {
  try {
    // Importamos las cookies con cookie parser
    const token = req.cookies.jwt;

    if (!token) {
      // Pasamos al siguiente middleware
      return next();
    } else {
      return res.redirect("/")
    }

  } catch (error) {
    console.log(error);
    res.redirect("/")
  }
};

module.exports = {
    isNotAuth,
};
