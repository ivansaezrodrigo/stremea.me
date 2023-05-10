// importamos express
const express = require('express');
const router = express.Router();

// Importamos los controladores
const controladorUser = require('../controllers/UserController');
const controladorRoom = require('../controllers/RoomController');
const controladorToken = require('../controllers/TokenController');
const vista = require('../controllers/ViewController');

// importamos el middleware de autenticación
const {isAuth} = require('../middlewares/isAuth');


// Rutas y vistas
router.get('/', vista.vistaLanding);
router.get('/cookies', vista.vistaCookies);
router.get('/login', vista.vistaLogin);
router.get('/signup', vista.vistaRegister);
router.get('/user', isAuth , vista.vistaPerfil);
router.get('/sayonara', isAuth , vista.vistaEliminarCuenta);
router.get('/reset-password', vista.vistaCambioPassword);
router.get('/miss-password', vista.vistaOlvidoPassword);
router.get('/banned', vista.vistaBanned);
router.get('/kicked', vista.vistaKicked);
router.get('/recovery', vista.vistaRecovery);
router.get('/recovered', vista.vistaRecovered);
router.get('/unsuscribe', isAuth , vista.vistaUnsuscribe);
router.get('/new', vista.vistaStreaming);


// -Ruta para darse de alta en la plataforma 
router.post('/signup', controladorUser.createUser);

// Ruta para loguearse en la plataforma
router.post('/login', controladorUser.loginUser);

// Ruta para desloguearse de la plataforma
router.get('/logout', controladorUser.logoutUser);

// -Ruta para darse de baja de la newsletter
router.post('/unsuscribe', controladorUser.unsubscribeNewsletter);

// -Ruta para darse de alta en la newsletter
router.post('/suscribe', controladorUser.subscribeNewsletter);

// Ruta para obtener un usuario por su id
router.get('/user/:id', isAuth ,controladorUser.getUserById);

// -Ruta para actualizar un usuario
router.put('/user', controladorUser.updateUser);

// -Ruta para borrar un usuario
//router.delete('/user/:aliasDelete', controladorUser.deleteUser);
router.post('/sayonara', controladorUser.deleteUser);

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

// - Ruta desconocida
router.use((req, res, next) => {
    res.status(404).render('404', { title: '404' });
});

module.exports = router;
