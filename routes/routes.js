// importamos express
const express = require('express');
const router = express.Router();

// Importamos los controladores
const controladorUser = require('../controllers/UserController');
const controladorRoom = require('../controllers/RoomController');
const controladorToken = require('../controllers/TokenController');

// Ruta raiz
router.get('/', (req, res) => {
    res.send('Futuro stremea.me!');
});

// -Ruta para darse de alta en la plataforma 
router.post('/signup', controladorUser.createUser);

// Ruta para loguearse en la plataforma

// -Ruta para darse de baja de la newsletter
router.post('/unsuscribe', controladorUser.unsubscribeNewsletter);

// -Ruta para darse de alta en la newsletter
router.post('/suscribe', controladorUser.subscribeNewsletter);

// Ruta para obtener un usuario por su id
//router.get('/user/:id', controladorUser.getUserById);

// -Ruta para actualizar un usuario
router.put('/user', controladorUser.updateUser);

// -Ruta para borrar un usuario
router.delete('/user', controladorUser.deleteUser);

// -Ruta para crear una Room
router.post('/create', controladorRoom.createRoom);

// Ruta para unirse a una Room
// router.post('/join', controladorRoom.joinRoom);

// -Ruta para unirse a una Room 
router.get('/join/:codigo', controladorRoom.joinRoom);

// -Ruta para actualizar el code de una Room
router.put('/refresh', controladorRoom.updateCode);

// -Ruta para salir de una Room
router.post('/leave', controladorRoom.leaveRoom);

// - Ruta para destruir una Room
router.delete('/destroy', controladorRoom.deleteRoom);

// -Ruta para actualizar una Room
router.put('/room', controladorRoom.updateRoom);

// -Ruta para hacer privada una Room
router.put('/private', controladorRoom.makePrivate);

// -Ruta para banear a un usuario de una Room
router.put('/ban', controladorRoom.banUser);


module.exports = router;
