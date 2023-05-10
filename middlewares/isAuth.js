// Middleware para comprobar si el usuario está autenticado

// Importamos el modelo de usuario
const modeloUser = require("../models").User;

// Importamos jwt
const jwt = require("jsonwebtoken");

const isAuth = async (req, res, next) => {
  try {
    // Importamos las cookies con cookie parser
    const token = req.cookies.jwt;
    
    // si no existe el token redirigimos al login
    if (!token) {
      return res.redirect("/login")
    }

    // Verificamos el token
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);

    // Buscamos el usuario en la base de datos
    const user = await modeloUser.findByPk(decoded.userId);
    //console.log(token,user);
    if (user) {
      // Pasamos al siguiente middleware
      return next();
    } else {
      return res.redirect("/login")
    }
  } catch (error) {
    console.log(error);
    res.redirect("/login")
  }
};

module.exports = {
    isAuth,
};
