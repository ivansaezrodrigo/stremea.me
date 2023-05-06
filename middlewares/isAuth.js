// Importamos la dependencia de cookies
const cookies = require("cookie-parser");

// Middleware para comprobar si el usuario está autenticado

const isAuth = async (req, res, next) => {
  try {
    // Importamos las cookies
    const token = req.cookies.token;
    

    // Comprobamos si existe la cabecera de autorización
    //const token = req.headers.authorization.split(" ")[1];

    // Verificamos el token
    const payload = jwt.verify(token, "process.env.SECRET_KEY");
    // Buscamos el usuario en la bbdd
    const user = await modeloUser.findByPk(payload.userId);
    if (user) {
      // Guardamos el usuario en el objeto request
      req.user = user;
      // Pasamos al siguiente middleware
      next();
    } else {
      res.status(401).send("Usuario no autenticado");
    }
  } catch (error) {
    res.status(401).send("Usuario no autenticado");
  }
};

module.exports = {
    isAuth,
};
