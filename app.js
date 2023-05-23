// Importamos cors
const cors = require('cors');
// Importamos express
const express = require('express');
// Importamos las variables de entorno
require('dotenv').config();

// Importamos webRTC 
const webrtc = require("wrtc");

// Importamos path
const path = require('path');

// Importamos Peer
const { ExpressPeerServer } = require("peer");

// Importamos la dependencia de cookies
const cookieParser = require('cookie-parser');

// Importamos express-ejs-layouts
const expressLayouts = require('express-ejs-layouts');

// Importamos las rutas
const router = require('./routes/routes.js');

// Usamos express
const app = express();

// Importamos http para poder usar socket.io
const http = require('http');
const server = http.createServer(app);

// Importamos socket.io
const {Server} = require('socket.io');
const io = new Server(server);

// Importamos body-parser
const bodyparser = require('body-parser');

// Usamos cookie-parser
app.use(cookieParser());


// Socket.io - Configuración

// Importamos la función para obtener los datos del usuario
const { datosUsuario, usuariosRoom, joinUser, userLeave, getRoomUsers} = require('./helpers/socketio.js');

var botName = "StremeaMe Bot";

// Cuando se conecte un usuario
io.on("connection", (socket) => {
    // a la escucha de echar a un usuario por el admin
    socket.on("echar", (msg) => {
        io.emit("echar", msg);
    });

    // a la escucha de unirse a una sala
    socket.on("joinRoom", ({ jwtChat, avatar }) => {
        // Obtenemos los datos del usuario
        const {usuario, roomCode} = datosUsuario(jwtChat,socket.id);
        socket.join(roomCode);

        //cogemos a la hora que se conecta el usuario
        var fecha = new Date();
        var horaActual = fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
        
        // Añadimos el usuario a la sala
        joinUser(socket.id, usuario.alias, roomCode, usuario.id, avatar);
  
      // Damos la bienvenida al usuario
      socket.emit("message", {name:botName+' - '+horaActual, message:"¡Bienvenido a a la sala de chat!", avatar:'0'});
  
      // Avisamos a los demás usuarios de que se ha unido un usuario
      socket.broadcast
        .to(roomCode)
        .emit(
          "message",
          {name:botName+' - '+horaActual, message:`${usuario.alias} has joined the chat`, avatar: '0'}
        );
  
      // Enviamos la información de los usuarios que hay en la sala a todos los usuarios que están en la sala
      io.to(roomCode).emit("roomUsers", {
        room: roomCode,
        users: getRoomUsers(roomCode),
      });
    });
  
    // Escuchamos los mensajes del chat
    socket.on("chatMessage", (msg) => {
        //cogemos a la hora que se envia el mensaje
        let fecha = new Date();
        let horaActual = fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();

      // Obtenemos los datos del usuario que ha enviado el mensaje
    const {usuario, roomCode} = datosUsuario(msg.jwtChat,socket.id);
    // Enviamos el mensaje a todos los usuarios de la sala excepto al que lo ha enviado
    if (usuario.rol == "mecenas") {
      io.to(roomCode).emit("message", {name:usuario.alias+' - '+horaActual, message:msg.comentario, avatar:usuario.id, socketId:msg.socketId});
    } else {
      io.to(roomCode).emit("message", {name:usuario.alias+' - '+horaActual, message:msg.comentario, avatar:msg.avatar, socketId:msg.socketId});
    }
}
    );
    
    // Cuando un usuario se desconecta
    socket.on("disconnect", () => {

      // Obtenemos los datos del usuario que se ha desconectado
        const {user, roomCode} = userLeave(socket.id);
      
        // Si el usuario existe
      if (user) {
        // Avisamos a los demás usuarios de que se ha desconectado un usuario
        io.to(roomCode).emit(
          "message",
          {name:botName+' - '+horaActual, message:`${usuario.alias} has left the chat`, avatar: '0'}
        );
  
        // Enviamos la información de los usuarios que hay en la sala a todos los usuarios que están en la sala
        io.to(roomCode).emit("roomUsers", {
            room: roomCode,
            users: getRoomUsers(roomCode),
        });
      }
    });
  });





// Agrega middleware para exponer las cookies a las vistas
app.use((req, res, next) => {
    res.locals.cookies = req.cookies;
    next();
});

// Usamos body-parser
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

// Usamos ejs como motor de plantillas
app.set('view engine', 'ejs');

// Usamos el directorio views para las plantillas
app.set('views', path.join(__dirname, '/views'));

// Usamos el directorio public como estático
app.use(express.static(path.join(__dirname, '/public')));

// Middleware para poder usar cors
app.use(cors());
app.use(express.json());

// Middleware que nos permite usar el body de la petición
app.use(expressLayouts);

// ######## Configuración de Peer ########

// Creamos el servidor
// const server = app.listen(9000);

const peerServer = ExpressPeerServer(server, {
	path: "/myapp",
});

app.use("/peerjs", peerServer);

// ######################################

// Rutas
app.use('/', router);

// Puerto
const port = process.env.PORT || 3000;

// Escuchamos el puerto
server.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
}
);



