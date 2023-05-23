"use strict";

// Importamos los modelos
const modeloRoom = require("../models").Room;
const modeloUser = require("../models").User;
const modeloRoomsUsers = require("../models").RoomsUsers;

// importamos localStorage
const localStorage = require("localStorage")

// importamos nanoid
const nanoid = require("nanoid");

// importamos jsonwebtoken
const jwt = require("jsonwebtoken");

// funcion para crear una sala
const createRoom = async (req, res) => {
  // Importamos las cookies con cookie parser
  const token = req.cookies.jwt;

  // Verificamos el token
  const decoded = await jwt.verify(token, process.env.SECRET_KEY);

  // Buscamos el usuario en la base de datos
  const user = await modeloUser.findByPk(decoded.userId);

  //si existe el usuario actualiza los campos que han sido modificados
  if (user) {
    try {
      // si no es propietario de una sala ya existente, puede crear una nueva
      const room = await modeloRoom.findOne({ where: { owner: user.id } });
      if (room) {
        res.redirect(`/room/${room.code}`);
      }
      // si no es propietario de una sala ya existente, puede crear una nueva
      if (!room) {
        // se crea un codigo aleatorio
        let code = nanoid.nanoid();
        // mientras que el codigo no exista en la base de datos, se crea la sala si el codigo ya existe, se crea uno nuevo y se vuelve a comprobar
        while (await modeloRoom.findOne({ where: { code } })) {
          code = nanoid.nanoid();
        }

        // se crea la sala
        const newRoom = await modeloRoom.create({
          code,
          owner: user.id,
          title: `👾 ¡Konichiwa chavales! - Disfrutad del streaming del tal ${user.alias} 🕹`,
          description:
            "¡Bienvenidos!¡Esta es mi nueva sala de chat! Tomad asiento y disfrutad del streaming.",
          private: false,
        });
        // se añade el usuario a la sala
        newRoom.addUser(user);

        // se redirige a la sala
        return res.redirect(`/room/${newRoom.code}`);
      }
    } catch (error) {
      // si hay un error se devuelve un error 500
      console.log(error);
      return res.status(500).json({ error: "Error creating room" });
    }
  } else {
    // si no existe el usuario se devuelve un error 404
    return res.redirect("/login");
  }
};

// funcion para unirse a una sala
const joinRoom = async (req, res) => {
  try {
    // recibe el codigo de la sala por get y el id del usuario por body
    const { codigo } = req.params;

    // se busca la sala por el codigo
    const room = await modeloRoom.findOne({ where: { code: codigo } });
    
    // si la sala no existe se devuelve un error
    if (room === null) {
      // se redirige a la pagina de inicio
      return res.render("landing", {
        title: "",
        error: true,
        message: "La sala ya no existe",
      });
    }

    // si la sala es privada y el usuario no es el propietario, se rediriige a la pagina de inicio
    if (room.private && room.owner !== req.body.userId) {
      // se redirige a la pagina de inicio
      return res.render("landing", {
        title: "Lo siento :(",
        error: true,
        message: "La sala es privada.",
      });
    }

    // se busca el propietario de la sala
    const propietario = await modeloUser.findByPk(room.owner);

    // si no tiene la cookie de jwt se redirige a login
    if (!req.cookies.jwt) {
      // se le guarda un token al usuario para que pueda chatear
      const tokenChat = jwt.sign({userEmail: 'Nobody' , room:codigo }, process.env.SECRET_KEY, {
        expiresIn: "4h",
      });
      
      // se le guarda un token al usuario para que pueda chatear en las cookies
      res.cookie("jwtChat", tokenChat, {
        httpOnly: false,
        maxAge: 14400000,
      });

      // se redirige a la sala
      return res.render("streaming", {
        title: "Streaming",
        room: room,
        usuarioRender: propietario,
        viewer: true,
      });
    }


    // Importamos las cookies con cookie parser
    const token = req.cookies.jwt;

    // Verificamos el token
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);

    // se guarda el id del usuario
    const userId = decoded.userId;

    // si el usuario no existe se devuelve un error
    const user = await modeloUser.findByPk(userId);

    // si el usuario no existe se devuelve un error
    if (!user) {
      res.status(404).json({ error: "User not found" });
    }

    // se comprueba si la sala ya existe
    if (room) {
      // si la sala es privada y el usuario no es el propietario, se devuelve un error
      if (room.private && room.owner !== userId) {
        // se redirige a la pagina de inicio
        return res.render("landing", {
          title: "",
          error: true,
          message: "Room is private",
        });
      }
      // si el usuario esta baneado de la sala, se devuelve un error
      const banned = await room.hasUser(
        { where: { id: userId } },
        { through: { banned: 1 } }
      );
      if (banned) {
        // se redirige a la pagina de inicio
        return res.render("landing", {
          title: "",
          error: true,
          message: "User is banned from this room",
        });
      }
      // se comprueba si el usuario ya está dentro de la sala y existe
      const joined = await room.hasUser(userId);

      // si el usuario no esta dentro de la sala, se le añade
      if (joined) {
        // transformamos el objeto usuario a variables para poder renderizarlo
        const { id,alias, rol, twitter, instagram, twitch, url } = user;
        const usuarioRender = { alias, rol, twitter, instagram, twitch, url };

        // se le guarda un token al usuario para que pueda chatear
        const tokenChat = jwt.sign({ id:id, rol,alias , userEmail: user.email , room:codigo }, process.env.SECRET_KEY, {
          expiresIn: "4h",
        });
        
        // se le guarda un token al usuario para que pueda chatear en las cookies
        res.cookie("jwtChat", tokenChat, {
          httpOnly: false,
          maxAge: 14400000,
        });
      }
      
      // si el usuairo es el usuario no es propietario de la sala envía una vista distinta
      if (room.owner !== userId) {
        return res.render("streaming", {
          title: "Streaming",
          room: room,
          usuarioRender: user,
          viewer: true,
        });
      }

      // si no está baneado ni dentro de la sala se añade a la sala
      await room.addUser(user);

      // se renderiza la vista de la sala con viewer a flase
      return res.render("streaming", {
            title: "Streaming",
            room: room,
            usuarioRender: propietario,
            viewer: false,
          });
    

    } else {
      // si la sala no existe se devuelve un error
      return res.render("landing", { title: "", error: true , message: "Room not available" });
    }
  } catch (error) {
    // si hay un error se devuelve un error 500
    return res.status(500).json({ error: "Error joining room" });
  }
};

// funcion para actualizar el codigo de la sala
const updateCode = async (req, res) => {
  // recibe el id del usuario por body
  const { userId } = req.body;
  try {
    // se busca la sala por el id del usuario
    const room = await modeloRoom.findOne({ where: { owner: userId } });

    // si la sala existe 
    if (room) {
      // si el usuario es propietario de la sala, actualiza el code con nanoid

      // se genera un nuevo codigo
      let code = nanoid.nanoid();

      // se comprueba que el codigo no exista
      while (await modeloRoom.findOne({ where: { code } })) {
        code = nanoid.nanoid();
      }
      // se actualiza el codigo de la sala
      await room.update({ code });
      // se devuelve un mensaje de exito
      res.status(200).json({ message: "Room updated successfully", room });
    } else {
      // si la sala no existe se devuelve un error
      res.status(403).json({ error: "User is not the owner of this room" });
    }
  } catch (error) {
    console.log(error);
    // si hay un error se devuelve un error 500
    res.status(500).json({ error: "Error updating room" });
  }
};

// funcion para dejar la sala
const leaveRoom = async (req, res) => {
  // recibe el codigo de la sala y el id del usuario por body
  const { code, userId } = req.body;

  try {
    // se busca la sala por el codigo
    const room = await modeloRoom.findOne({ where: { code } });
    // si la sala existe
    if (room) {
      // si esta en la sala puede salir
      const joined = await room.hasUser(userId);
      // si la sala existe y el usuario esta dentro de la sala
      if (joined) {
        // se busca el usuario por el id
        const user = await modeloUser.findByPk(userId);
        // se elimina el usuario de la sala
        await room.removeUser(user);
        // se devuelve un mensaje de exito
        res.status(200).json({ message: "User left successfully", room });
      } else {
        // si el usuario no esta dentro de la sala se devuelve un error
        res.status(403).json({ error: "User is not in this room" });
      }
    } else {
      res.status(404).json({ error: "Room not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error leaving room" });
  }
};

// funcion para obtener todas las salas
const getAllRooms = async (req, res) => {
  try {
    // se buscan todas las salas y se devuelven
    const rooms = await modeloRoom.findAll();
    res.status(200).send(rooms);
  } catch (error) {
    res.status(500).send("Error al obtener las salas");
  }
};

// funcion para obtener una sala por id
const getRoomById = async (req, res) => {
  try {
    const room = await modeloRoom.findByPk(req.params.id);
    if (room) {
      res.status(200).send(room);
    } else {
      res.status(404).send("Sala no encontrada");
    }
  } catch (error) {
    res.status(500).send("Error al obtener la sala");
  }
};

// funcion para obtener una sala por codigo
const getRoomByCode = async (req, res) => {
  try {
    const room = await modeloRoom.findByPk(req.params.code);
    if (room) {
      res.status(200).send(room);
    } else {
      res.status(404).send("Sala no encontrada");
    }
  } catch (error) {
    res.status(500).send("Error al obtener la sala");
  }
};

// funcion para actualizar una sala
const updateRoom = async (req, res) => {
  try {
    // Importamos las cookies con cookie parser
    const token = req.cookies.jwt;

    // Verificamos el token
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);

    const userId = decoded.userId;
    // si el usuario no existe se devuelve un error
    const user = await modeloUser.findByPk(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
    }

    // se busca la sala asociada al usuario
    const room = await modeloRoom.findOne({ where: { owner: userId } });

    if (room) {
      // si la sala existe y el usuario es el propietario de la sala puede actualizarla
      const sala = await modeloRoom.findOne({ where: { owner: userId } });
      if (sala) {
        if (req.body.titulo && req.body.titulo !== sala.title) {
          sala.title = req.body.titulo;
        }
        if (req.body.descripcion && req.body.descripcion !== sala.description) {
          sala.description = req.body.descripcion;
        }
        await sala.save();
        res.status(200).send();
      } else {
        res.status(404).send("Sala no encontrada");
      }
    }
  } catch (error) {
    console.log(error);
    res.status(401).send("Error al actualizar la sala");
  }
};

// funcion para eliminar una sala
const deleteRoom = async (req, res) => {
  try {
    // Importamos las cookies con cookie parser
    const token = req.cookies.jwt;

    // Verificamos el token
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);

    const userId = decoded.userId;
    // si el usuario no existe se devuelve un error
    const user = await modeloUser.findByPk(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
    }

    // se busca la sala asociada al usuario
    const room = await modeloRoom.findOne({ where: { owner: userId } });

    if (room) {
      // si la sala existe y el usuario es el propietario de la sala puede eliminarla
      const sala = await modeloRoom.findOne({ where: { owner: userId } });
      if (sala) {
        await sala.destroy();
        return res.status(200).send("Sala eliminada");
      } else {
        return res.status(404).send("Sala no encontrada");
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error al eliminar la sala");
  }
};

// funcion para hacer una sala privada o publica
const makePrivate = async (req, res) => {
  try {
    // Importamos las cookies con cookie parser
    const token = req.cookies.jwt;

    // Verificamos el token
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);

    const userId = decoded.userId;

    // si la sala existe y el usuario es el propietario de la sala puede actualizarla
    const sala = await modeloRoom.findOne({ where: { owner: userId } });
    if (sala) {
      sala.private = !sala.private;
      await sala.save();
      res.status(200).send(sala.private);
    }
  } catch (error) {
    console.log(user);
    console.log(error);
    res.status(401).send("Error al actualizar la sala");
  }
};

// funcion para banear a un usuario
const banUser = async (req, res) => {
  try {
    // obtenemos code y userId
    const { userId, banId } = req.body;
    // si la sala existe y el propietario es el usuario
    const sala = await modeloRoom.findOne({ where: { owner: userId } });
    const user = await modeloUser.findByPk(banId);

    // si el user pertenece a la sala
    const joined = await sala.hasUser(banId);
    if (sala && user && joined) {
      // cambia el parametro banned del usuario con la id banId a true | url de la info: https://sequelize.org/master/manual/model-querying-basics.html
      modeloRoomsUsers.update({ banned: true }, { where: { userId: banId } });

      res.status(200).send("Usuario baneado");
    } else {
      res.status(401).json({ error: "No eres el propietario de la sala" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).send("Error al actualizar la sala");
  }
};

module.exports = {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  joinRoom,
  leaveRoom,
  getRoomByCode,
  updateCode,
  makePrivate,
  banUser,
};
