// importamos el modelo
const modeloUser = require("../models").User;

// Importamos las variables de entorno
require("dotenv").config({ path: "../.env" });

// importamos el helper de validacion
const {
  isValidEmail,
  isValidPassword,
  isValidUsername,
  isValidUrl,
  isEmailInUse,
} = require("../helpers/validateField");
// importamos bcrypt para encriptar el password
const bcrypt = require("bcrypt");

// importamos el helper para generar el token
const { generateToken } = require("../helpers/jwt");

// importamos jsonwebtoken
const jwt = require("jsonwebtoken");

// importamos el joi para validar los campos
const Joi = require("@hapi/joi");

// Metodos para el CRUD

// Metodo para crear un usuario
const createUser = async (req, res) => {
  // Comprobamos que el usuario no existe
  const user = await modeloUser.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (user) {
    // Devolvemos un error con el mismo formato que el joi
    const error = {
      details: [
        {
          message: "El usuario ya existe.",
          path: ["email"],
          type: "any.empty",
          context: {
            label: "email",
            value: req.body.email,
            key: "email",
          },
        },
      ],
    };
    res.render("register", { title: "Registro", errors: error });
  } else {
    // Validamos los campos del formulario de registro
    const schemaRegister = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      password2: Joi.ref("password"),
    });

    // Validamos los datos
    const { error } = schemaRegister.validate(req.body);

    // Si no hay errores creamos el usuario
    if (!error) {
      try {
        // Si el usuario no existe y el email y password son validos
        const passwordEncriptado = bcrypt.hashSync(req.body.password, 10);

        // Importamos el array de usuarios aleatorio de la variable de entorno
        const users = process.env.USERS.split(",");

        // Creamos el usuario
        const newUser = await modeloUser.create({
          alias: users[Math.floor(Math.random() * users.length)],
          email: req.body.email.toLowerCase(),
          password: passwordEncriptado,
          rol: "user",
          newsletter: true,
        });

        try {
          // Buscamos el usuario en la base de datos
          const user = await modeloUser.findOne({
            where: {
              email: req.body.email,
            },
          });

          // creamos el token
          const payload = {
            userId: user.id,
            email: user.email,
            rol: user.rol,
          };
          const token = generateToken(payload, "4h");

          res.cookie("jwt", token, {
            maxAge: 4 * 60 * 60 * 1000,
            httpOnly: true,
          });
          res.redirect("/");
        } catch (error) {
          console.log(error);
          res.status(400).send("Error al loguearse");
        }
      } catch (error) {
        console.log(error);
        res.status(500).send("Error al crear el usuario");
      }
    } else {
      // Si hay errores en la validación, renderizamos la página de registro con los errores
      res.render("register", { title: "Registro", errors: error.details });
    }
  }
};

// Metodo para obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const users = await modeloUser.findAll();
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send("Error al obtener los usuarios");
  }
};

// Metodo para obtener un usuario por su id
const getUserById = async (req, res) => {
  try {
    const user = await modeloUser.findByPk(req.params.id);
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  } catch (error) {
    res.status(400).send("Error al obtener el usuario");
  }
};

// Metodo para actualizar un usuario
const updateUser = async (req, res) => {
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

    //si existe el usuario actualiza los campos que han sido modificados
    if (user) {
      // comprobamos que el password es distinto al que ya tiene el usuario
      if (
        req.body.password &&
        !bcrypt.compareSync(req.body.password, user.password)
      ) {
        // encriptamos el password
        const passwordEncriptado = bcrypt.hashSync(req.body.password, 10);
        user.password = passwordEncriptado;
      }
      if (req.body.email) {
        const emailMinus = req.body.email.toLowerCase();
        // comprobamos que el email es valido y no existe en la bbdd
        if (
          isValidEmail(req.body.email) &&
          modeloUser.findOne({ where: { email: emailMinus } })
        ) {
          user.email = emailMinus;
        } else {
          res.status(400).send("El email no es valido o ya esta en uso");
          return;
        }
      }
      if (req.body.twitter && req.body.twitter != user.twitter) {
        // comprobamos que el twitter es valido
        if (isValidUsername(req.body.twitter)) {
          user.twitter = req.body.twitter;
        } else {
          res.status(400).send("El twitter no es valido");
          return;
        }
      }
      if (req.body.instagram && req.body.instagram != user.instagram) {
        // comprobamos que el instagram es valido
        if (isValidUsername(req.body.instagram)) {
          user.instagram = req.body.instagram;
        } else {
          res.status(400).send("El instagram no es valido");
          return;
        }
      }

      if (req.body.twitch && req.body.twitch != user.twitch) {
        // comprobamos que el twitch es valido
        if (isValidUsername(req.body.twitch)) {
          user.twitch = req.body.twitch;
        } else {
          res.status(400).send("El twitch no es valido");
          return;
        }
      }
      if (req.body.url && req.body.url != user.url) {
        // comprobamos que la url es valida
        if (isValidUrl(req.body.url)) {
          user.url = req.body.url;
        } else {
          res.status(400).send("La url no es valida");
          return;
        }
      }

      // si se ha modificado algo se devuelve  un mensaje de usuario actualizado
      if (user.changed()) {
        res.status(200).send("Usuario actualizado");
      } else {
        res.status(200).send("No se ha modificado nada");
      }

      // guardamos los cambios
      await user.save();
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Error al actualizar el usuario");
  }
};

// Metodo para borrar un usuario
const deleteUser = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await modeloUser.findByPk(decoded.userId);

    if (user.alias == req.body.aliasDelete) {

        user.destroy();
        // borramos la cookie
        res.clearCookie("jwt");
        res.status(200).send("Usuario borrado");

        // res.status(200).send("Usuario borrado");
      } else {
        res.redirect("/sayonara");
      }

  } catch (error) {
    console.log(error);
    res.status(400).send("Error al borrar el usuario");
  }
};

// Metodo para darse de baja de la newsletter
const unsubscribeNewsletter = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await modeloUser.findByPk(userId);
    if (user) {
      await user.update({
        newsletter: false,
      });
      res.status(200).send("Usuario dado de baja de la newsletter");
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  } catch (error) {
    res.status(400).send("Error al darse de baja de la newsletter");
  }
};

// Metodo para darse de alta de la newsletter
const subscribeNewsletter = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await modeloUser.findByPk(userId);
    if (user) {
      await user.update({
        newsletter: true,
      });
      res.status(200).send("Usuario dado de alta de la newsletter");
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  } catch (error) {
    res.status(400).send("Error al darse de alta de la newsletter");
  }
};

// Metodo para cambiar el rol de un usuario
const changeRol = async (req, res) => {
  try {
    const { userId, rol } = req.body;
    const user = await modeloUser.findByPk(userId);
    if (user) {
      await user.update({
        rol: rol,
      });
      res.status(200).send("Rol cambiado");
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  } catch (error) {
    res.status(400).send("Error al cambiar el rol");
  }
};

// Metodo para loguearse
const loginUser = async (req, res) => {
  // Validamos los campos del formulario de login
  const schemaLogin = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  // Validamos los datos
  const { error } = schemaLogin.validate(req.body);

  if (error) {
    // si hay errores devolvemos el formulario con los errores
    return res.render("login", {
      title: "Iniciar sesión",
      errors: error.details,
    });
  } else {
    try {
      const { email, password } = req.body;

      // pasamos el email a minusculas
      const emailMinus = email.toLowerCase();
      // comprobamos que el email existe en la bbdd
      const user = await modeloUser.findOne({ where: { email: emailMinus } });
      if (user) {
        // comprobamos que el password es correcto
        if (bcrypt.compareSync(password, user.password)) {
          // creamos el token
          const payload = {
            userId: user.id,
            email: user.email,
            rol: user.rol,
          };
          const token = generateToken(payload, "4h");

          res.cookie("jwt", token, {
            maxAge: 4 * 60 * 60 * 1000,
            httpOnly: true,
          });
          res.redirect("/");
          //res.render("landing", { title: "Iniciar sesión", token: token });
        } else {
          // si el password no es correcto devolvemos un error
          res.render("login", {
            title: "Iniciar sesión",
            errors: { message: "El password no es correcto" },
          });
        }
      } else {
        // si el usuario no existe devolvemos un error
        res.render("login", {
          title: "Iniciar sesión",
          errors: { message: "Usuario no encontrado" },
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).send("Error al loguearse");
    }
  }
};

// Metodo para desloguearse
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.redirect("/");
  } catch (error) {
    res.status(400).send("Error al desloguearse");
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  unsubscribeNewsletter,
  subscribeNewsletter,
  changeRol,
  loginUser,
  logoutUser,
};
