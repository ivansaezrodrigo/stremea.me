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

// Ruta para darse de alta en la plataforma
router.post('/signup', controladorUser.createUser);

// Ruta para loguearse en la plataforma

// Ruta para darse de baja de la newsletter
router.post('/unsuscribe', controladorUser.unsubscribeNewsletter);

// Ruta para darse de alta en la newsletter
router.post('/suscribe', controladorUser.subscribeNewsletter);

// Ruta para obtener un usuario por su id
router.get('/user/:id', controladorUser.getUserById);

// Ruta para actualizar un usuario
router.put('/user/:id', controladorUser.updateUser);

// Ruta para borrar un usuario
router.delete('/user/:id', controladorUser.deleteUser);

// Ruta para crear una Room
router.post('/create', controladorRoom.createRoom);

// Ruta para unirse a una Room
// router.post('/join', controladorRoom.joinRoom);

// Ruta para unirse a una Room 
router.get('/join/:codigo', controladorRoom.joinRoom);

// Ruta para salir de una Room
router.post('/leave', controladorRoom.leaveRoom);

// Ruta para destruir una Room
router.delete('/destroy', controladorRoom.deleteRoom);



module.exports = router;
