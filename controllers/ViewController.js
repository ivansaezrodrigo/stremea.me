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
    // Verificamos el token
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);

    // Buscamos el usuario en la base de datos
    const user = await modeloUser.findByPk(decoded.userId);

    const {
      id,
      email,
      alias,
      rol,
      twitter,
      twitch,
      instagram,
      url,
      newsletter,
    } = user.dataValues;

    //console.log(token,user);
    if (user) {
      return res.render("perfil", {
        title: "- Perfil",
        user: {
          email,
          alias,
          rol,
          twitter,
          twitch,
          instagram,
          url,
          newsletter,
        },
      });
    } else {
      console.log(error);
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/login");
  }
};

const vistaEliminarCuenta = async function (req, res) {
  try {
    // Importamos las cookies con cookie parser
    const token = req.cookies.jwt;

    // Verificamos el token
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);

    // Buscamos el usuario en la base de datos
    const user = await modeloUser.findByPk(decoded.userId);

    const { id, email, alias, rol, twitter, twitch, instagram, url } =
      user.dataValues;

    //console.log(token,user);
    if (user) {
      res.render("eliminarCuenta", {
        title: "- Eliminar cuenta",
        user: { email, alias, rol, twitter, twitch, instagram, url },
      });
    } else {
      console.log(error);
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/login");
  }
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

const vistaStreaming = function (req, res) {
  res.render("streaming", { title: "- Generar sala" });
};

const vistaStreamer = function (req, res) {
  res.render("streamer", { title: "- Retransmitir en sala" });
};

const vistaViewer = function (req, res) {
  res.render("viewer", { title: "- Ver sala" });
};

const vistaRecovering = function (req, res) {
  res.render("recovering", {
    title: "- Recuperar contraseña",
    tokenRecu: req.params.token,
  });
};

const vistaUnsuscribe = async function (req, res) {
  // validamos con un regex que el token sea correcto
  const regex = /^[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+$/;
  if (!regex.test(req.params.token)) {
    return res.render("/", {
      updated: false,
      message: "Error al dar de baja",
    });
  }
  // verificamos el token
  try {
    const decoded = jwt.verify(req.params.token, process.env.SECRET_KEY);

    // comprobamos a que id de usuario está asociado el emailRecuperacion del token
    const user = await modeloUser.findOne({
      where: { email: decoded.emailRecuperacion },
    });

    // si el usuario existe lo dessuscribimos del newsletter
    if (user) {
      user.newsletter = false;
      await user.save();
      return res.render("landing", {
        title:"",
        updated: true,
        message: "Dado de baja satisfactoriamente",
      });
    }
  } catch (error) {
    return res.render("landing", { title:"" ,updated: false, message: "Error al dar de baja" });
  }

  return res.render("recovering", {
    title: "- Darse de baja",
    tokenRecu: req.params.token,
  });
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
  vistaRecovering,
  vistaStreamer,
  vistaViewer,
};
