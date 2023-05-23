// Importamos el paquete de jsonwebtoken
const jwt = require('jsonwebtoken');

// Importamos las variables de entorno
require("dotenv").config({ path: "../.env" });


// Importamos el modelo room
const modeloUser = require("../models").User;
const modeloRoom = require("../models").Room;

// lista de usuarios y salas de chat temporales
usuarioSalas = [];

// funcion para unir usuario a sala
function joinUser(socketid, alias, room, id, avatar){
    // Buscamos la sala en el array de salas
    const index = usuarioSalas.findIndex(usuario => usuario.room === room);

    if (index !== -1) {
        // miramos si ya existe un usuario con ese id
        const indexUser = usuarioSalas[index].users.findIndex(usuario => usuario.id === id);
        // si ya existe no hacemos nada y si no existe lo añadimos
        if(indexUser === -1){
            usuarioSalas[index].users.push({socketid, alias, id, avatar});
        }

    } else {
        // Si la sala no existe, la creamos y añadimos el usuario al array de usuarios
        usuarioSalas.push({room, users: [{socketid, alias, id, avatar}]});
    }
}

// User leaves chat
function userLeave(socketid) {
  let usuario = null;
  let roomCode = null;

  // Buscar el usuario en el array de salas y cuando lo encuentre lo elimina
  for (const sala of usuarioSalas) {
    const index = sala.users.findIndex((usuario) => usuario.socketid === socketid);
    if (index !== -1) {
      usuario = sala.users.splice(index, 1)[0];
      roomCode = sala.room;
      if (sala.users.length === 0) {
        const salaIndex = usuarioSalas.findIndex((s) => s.room === sala.room);
        usuarioSalas.splice(salaIndex, 1);
      }
      break;
    }
  }

  return { usuario, roomCode };
}


// funcion para obtener los usuarios de una sala
function getRoomUsers(room) {
   // Buscar la sala en el JSON
    const sala = usuarioSalas.find((item) => item.room === room);
  
  // Verificar si se encontró la sala
  if (sala) {
    // Obtener los usuarios de la sala y crear un nuevo arreglo de objetos
    const usuarios = sala.users.map((user) => ({
      alias: user.alias,
      socketId: user.socketid,
        id: user.id,
        avatar: user.avatar
    }));

    // Devolver el arreglo de usuarios
    return usuarios;
  } else {
    // Devolver un arreglo vacío si la sala no se encontró
    return [];
  }
}

// funcion para obtener los datos del usuario a partir del token
function datosUsuario(jwtChat,socketid){
    const token = jwtChat

    // se decodifica el token
    const {userEmail,alias,id,rol, room} = jwt.verify(token, process.env.SECRET_KEY);
    
    // si no hay email, el usuario es anonimo
    if(userEmail == 'Nobody'){
        usuarioAnonimo = {alias: 'Anonimo', id: socketid};
        return {usuario: usuarioAnonimo, roomCode:room};
    } 
   
    // se crea el objeto usuario
    usuario = {userEmail,alias,id,rol, room};

    // se devuelve el usuario y la sala
    return {usuario, roomCode:room};

   // return {usuario, roomCode:room};
}

// sacamos los usuarios de la room y devolvemos un array con los alias y su id
function usuariosRoom(room){
    // sacamos los usuarios de la room y devolvemos un array con los alias y su id
    const usuarios = modeloRoom.findAll({
        where: {
            code: room
        }
    }).then(usuarios => {

        const usuariosRoom = usuarios.map(usuario => {
            return {alias: usuario.alias, id: usuario.id}
        });

        return usuariosRoom;
    });

    return null;
}

module.exports = {
    datosUsuario,
    usuariosRoom,
    joinUser,
    userLeave,
    getRoomUsers
}