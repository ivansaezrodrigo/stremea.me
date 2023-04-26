"use strict";
const modeloRoom = require("../models").Room;
const modeloUser = require("../models").User;
const modeloRoomsUsers = require("../models").RoomsUsers;

const nanoid = require("nanoid");

const createRoom = async (req, res) => {
  const { title, description, isPrivate, userId } = req.body;
  try {
    // si no es propietario de una sala ya existente, puede crear una nueva
    const user = await modeloUser.findByPk(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const room = await modeloRoom.findOne({ where: { owner: userId } });
    if (room) {
      res
        .status(403)
        .json({ error: "User already owns a room", code: room.code });
    }
    // si no es propietario de una sala ya existente, puede crear una nueva
    if (!room) {
      // se crea un codigo aleatorio
      let code = nanoid.nanoid();
      // mientras que el codigo no exista en la base de datos, se crea la sala si el codigo ya existe, se crea uno nuevo y se vuelve a comprobar
      while (await modeloRoom.findOne({ where: { code } })) {
        code = nanoid.nanoid();
      }

      const newRoom = await modeloRoom.create({
        code,
        owner: userId,
        title,
        description,
        private: isPrivate,
      });
      // se añade el usuario a la sala
      newRoom.addUser(user);
      res.status(201).json(newRoom);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating room" });
  }
};

const joinRoom = async (req, res) => {
  // recibe el codigo de la sala por get y el id del usuario por body
  const { codigo } = req.params;
  const { userId } = req.body;
  try {
    // si el usuario no existe se devuelve un error
    const user = await modeloUser.findByPk(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
    }

    // se busca la sala por el codigo
    const room = await modeloRoom.findOne({ where: { code: codigo } });
    if (room) {
      // si el usuario esta baneado de la sala, se devuelve un error
      const banned = await room.hasUser(userId, { through: { banned: 1 } });
      if (banned) {
        res.status(403).json({ error: "User is banned from this room" });
      }
      // se comprueba si el usuario ya está dentro de la sala y existe
      const joined = await room.hasUser(userId);
      if (joined) {
        res.status(200).json({ message: "User is already in this room" });
      }

      // si no está baneado ni dentro de la sala se añade a la sala
      await room.addUser(user);
      res.status(200).json({ message: "User joined successfully", room });
    } else {
      res.status(404).json({ error: "Room not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error joining room" });
  }
};

const updateCode = async (req, res) => {
  const { userId } = req.body;
  try {
    const room = await modeloRoom.findOne({ where: { owner: userId } });
    if (room) {
      // si el usuario es propietario de la sala, actualiza el code con nanoid
      let code = nanoid.nanoid();
      while (await modeloRoom.findOne({ where: { code } })) {
        code = nanoid.nanoid();
      }
      await room.update({ code });
      res.status(200).json({ message: "Room updated successfully", room });
    } else {
      res.status(403).json({ error: "User is not the owner of this room" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error updating room" });
  }
};

const leaveRoom = async (req, res) => {
  const { code, userId } = req.body;
  try {
    const room = await modeloRoom.findOne({ where: { code } });
    if (room) {
      // si esta en la sala puede salir
      const joined = await room.hasUser(userId);
      if (joined) {
        const user = await modeloUser.findByPk(userId);
        await room.removeUser(user);
        res.status(200).json({ message: "User left successfully", room });
      } else {
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

const getAllRooms = async (req, res) => {
  try {
    const rooms = await modeloRoom.findAll();
    res.status(200).send(rooms);
  } catch (error) {
    res.status(500).send("Error al obtener las salas");
  }
};

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

const updateRoom = async (req, res) => {
  try {
    // obtenemos la sala por el codigo y el usuario por el id
    const { userId } = req.body;

    // si la sala existe y el usuario es el propietario de la sala puede actualizarla
    const sala = await modeloRoom.findOne({ where: { owner: userId } });
    if (sala) {
      if (req.body.title && req.body.title !== sala.title) {
        sala.title = req.body.title;
      }
      if (req.body.description && req.body.description !== sala.description) {
        sala.description = req.body.description;
      }
      await sala.save();
      res.status(200).send("Sala actualizada");
    } else {
      res.status(404).send("Sala no encontrada");
    }
  } catch (error) {
    console.log(error);
    res.status(401).send("Error al actualizar la sala");
  }
};

const deleteRoom = async (req, res) => {
  try {
    // obtenemos code y userId
    const { code, userId } = req.body;
    // si la sala existe y el usuario es el propietario de la sala puede eliminarla
    if (await modeloRoom.findOne({ where: { code, owner: userId } })) {
      await modeloRoom.destroy({ where: { code } });
      res.status(200).send("Sala eliminada");
    } else {
      res.status(404).send("Sala no encontrada");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al eliminar la sala");
  }
};

const makePrivate = async (req, res) => {
  try {
    // obtenemos code y userId
    const { userId } = req.body;
    // si la sala existe y el propietario es el usuario
    const sala = await modeloRoom.findOne({ where: { owner: userId } });
    const user = await modeloUser.findByPk(userId);
    // si el usuario tiene el rol de "mecenas" puede hacer la sala privada
    if (sala && user.rol == "mecenas") {
      sala.private = !sala.private;
      await sala.save();
      res.status(200).send("Sala actualizada");
    } else {
      res.status(401).json({ error: "No eres mecenas" });
    }
  } catch (error) {
    console.log(user);
    console.log(error);
    res.status(401).send("Error al actualizar la sala");
  }
};

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
      modeloRoomsUsers.update( { banned: true }, { where: { userId: banId } } );

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
