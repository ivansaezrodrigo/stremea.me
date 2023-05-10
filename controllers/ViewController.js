// importamos el modelo
const modeloUser = require("../models").User;

// importamos jsonwebtoken
const jwt = require("jsonwebtoken");

const vistaPrincipal = function (req, res) {
  res.render("layout");
};

const vistaLanding = function (req, res) {
  res.render("landing", { title: "" });
};

const vistaCookies = function (req, res) {
  res.render("cookies", { title: "- Cookies" });
};

const vistaLogin = function (req, res) {
  res.render("login", { title: "- Iniciar sesión" });
};

const vistaRegister = function (req, res) {
  res.render("register", { title: "- Registro" });
};

const vistaPerfil = async function (req, res) {
  try {
    // Importamos las cookies con cookie parser
    const token = req.cookies.jwt;

    // si no existe el token redirigimos al login
    if (!token) {
      return res.redirect("/login");
    }

    // Verificamos el token
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);

    // Buscamos el usuario en la base de datos
    const user = await modeloUser.findByPk(decoded.userId);

    const {id, email, alias, rol,twitter, twitch, instagram, url} = user.dataValues;

    //console.log(token,user);
    if (user) {
      return res.render("perfil", { title: "- Perfil" , user: {email, alias, rol,twitter, twitch, instagram, url}});
    } else {
      console.log(error);
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/login");
  }
};

const vistaEliminarCuenta = function (req, res) {
  res.render("eliminarCuenta", { title: "- Eliminar cuenta" });
};

const vistaCambioPassword = function (req, res) {
  res.render("cambioPassword", { title: "- Cambio de contraseña" });
};

const vistaOlvidoPassword = function (req, res) {
  res.render("olvidoPassword", { title: "- Olvido de contraseña" });
};

const vistaBanned = function (req, res) {
  res.render("banned", { title: "- Has sido baneado" });
};

const vistaKicked = function (req, res) {
  res.render("kicked", { title: "- Has sido expulsado" });
};

const vistaRecovery = function (req, res) {
  res.render("recovery", { title: "- Recuperar contraseña" });
};

const vistaRecovered = function (req, res) {
  res.render("recovered", { title: "- Correo enviado" });
};

const vistaUnsuscribe = function (req, res) {
  res.render("unsuscribe", { title: "- Darse de baja" });
};

const vistaStreaming = function (req, res) {
  res.render("streaming", { title: "- Generar sala" });
};

module.exports = {
  vistaLanding,
  vistaPrincipal,
  vistaCookies,
  vistaLogin,
  vistaRegister,
  vistaPerfil,
  vistaEliminarCuenta,
  vistaCambioPassword,
  vistaOlvidoPassword,
  vistaBanned,
  vistaKicked,
  vistaRecovery,
  vistaRecovered,
  vistaUnsuscribe,
  vistaStreaming,
};
