// importamos el modelo
const modeloUser = require("../models").User;
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


// Metodos para el CRUD

// Metodo para crear un usuario

const createUser = async (req, res) => {
  try {
    // Comprobamos que el usuario no existe
    const user = await modeloUser.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (user) {
      // Si el usuario existe devolvemos un error
      res.status(400).send("El usuario ya existe");
    } else if (!isValidEmail(req.body.email)) {
      // Si el email no es valido

      res.status(400).send("El email no es valido");
    } else if (!isValidPassword(req.body.password)) {
      // Si el password no es valido
      res.status(400).send("El password no es valido");
    } else {
      // Si el usuario no existe y el email y password son validos
      const passwordEncriptado = bcrypt.hashSync(req.body.password, 10);
      // Creamos el usuario
      const newUser = await modeloUser.create({
        email: req.body.email.toLowerCase(),
        password: passwordEncriptado,
        rol: "user",
        newsletter: true,
      });
      // Devolvemos el usuario creado
      res.status(201).send(newUser);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Error al crear el usuario");
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
    // busca usuario por su id
    const user = await modeloUser.findByPk(req.body.id);
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
    const user = await modeloUser.findByPk(req.body.id);
    if (user) {
      await user.destroy();
      res.status(200).send("Usuario borrado");
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  } catch (error) {
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
  try {
    const { email, password } = req.body;

    // comprobamos que el email es valido
    if (!isValidEmail(email)) {
      res.status(400).send("El email no es valido");
      return;
    } else {
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

          res.status(200).send({ token: token });
        } else {
          res.status(400).send("Password incorrecto");
        }
      } else {
        res.status(404).send("Usuario no encontrado");
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Error al loguearse");
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
};
