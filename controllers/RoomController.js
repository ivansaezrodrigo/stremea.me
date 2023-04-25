"use strict";
const modeloRoom = require("../models").Room;
const modeloUser = require("../models").User;
const nanoid = require("nanoid");

const createRoom = async (req, res) => {
  const { title, description, isPrivate, userId } = req.body;
  try {
    // si no es propietario de una sala ya existente, puede crear una nueva
    const room = await modeloRoom.findOne({ where: { owner: userId } });
    if (room) {
      res
        .status(403)
        .json({ error: "User already owns a room", code: room.code });
    }
    // si no es propietario de una sala ya existente, puede crear una nueva
    if (!room) {
      // se crea un codigo aleatorio
      const code = nanoid.nanoid();
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
      await newRoom.addUser(userId, { through: { banned: 0 } });
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
    // const user = await modeloUser.findByPk(userId);
    // if (!user) {
    //     res.status(404).json({ error: "User not found" });
    // }
    // Esto se contempla en el middleware de autenticación

    // se busca la sala por el codigo
    const room = await modeloRoom.findOne({ where: { code: codigo } });
    if (room) {
      // se comprueba si el usuario ya está dentro de la sala y existe
      const joined = await room.hasUser(userId);
        if (joined) {
        res.status(403).json({ error: "User is already in this room" });
      } else {
        // si la sala existe y el usuario no está dentro, se comprueba que el usuario no esté baneado
        const banned = await room.hasUser(userId, { through: { banned: 1 } });
        if (banned) {
          res.status(403).json({ error: "User is banned from this room" });
        } else {
          // si no está baneado, se añade a la sala
          const user = await modeloUser.findByPk(userId);
          await room.addUser(user);
          res.status(200).json({ message: "User joined successfully", room });
        }
      }
    } else {
      res.status(404).json({ error: "Room not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error joining room" });
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
    const room = await modeloRoom.findByPk(req.params.id);
    if (room) {
      await room.update({
        code: req.body.code,
        owner: req.body.owner,
        title: req.body.title,
        description: req.body.description,
        private: req.body.private,
      });
      res.status(200).send(room);
    } else {
      res.status(404).send("Sala no encontrada");
    }
  } catch (error) {
    res.status(500).send("Error al actualizar la sala");
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

module.exports = {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  joinRoom,
  leaveRoom,
  getRoomByCode,
};
