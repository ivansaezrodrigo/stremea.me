// importamos express
const express = require('express');
const router = express.Router();

// importamos wrtc
const webrtc = require("wrtc");

// Importamos los controladores
const controladorUser = require('../controllers/UserController');
const controladorRoom = require('../controllers/RoomController');
const controladorToken = require('../controllers/TokenController');
const vista = require('../controllers/ViewController');

// importamos el middleware de autenticación
const {isAuth} = require('../middlewares/isAuth');
const {isNotAuth} = require('../middlewares/isNotAuth');


// Rutas y vistas
router.get('/', vista.vistaLanding);
router.get('/cookies', vista.vistaCookies);
router.get('/login' , vista.vistaLogin);
router.get('/signup', vista.vistaRegister);
router.get('/user', isAuth , vista.vistaPerfil);
router.get('/sayonara', isAuth , vista.vistaEliminarCuenta);
router.get('/reset-password', vista.vistaCambioPassword);
router.get('/miss-password', isNotAuth , vista.vistaOlvidoPassword);
router.get('/banned', vista.vistaBanned);
router.get('/kicked', vista.vistaKicked);
router.get('/recovery', vista.vistaRecovery);
router.get('/recovered', vista.vistaRecovered);

// Rutas y vistas con token
router.get('/recovering/:token', isNotAuth ,vista.vistaRecovering);
router.get('/unsubscribe/:token' , vista.vistaUnsuscribe);

// -Ruta para darse de alta en la plataforma 
router.post('/signup', controladorUser.createUser);

// Ruta para loguearse en la plataforma
router.post('/login' , controladorUser.loginUser);

// Ruta para desloguearse de la plataforma
router.get('/logout' , controladorUser.logoutUser);

// -Ruta para darse de baja de la newsletter
router.post('/unsuscribe', controladorUser.unsubscribeNewsletter);

// -Ruta para darse de alta en la newsletter
router.post('/suscribe', controladorUser.subscribeNewsletter);

// Ruta para obtener un usuario por su id
router.get('/user/:id' ,controladorUser.getUserById);

// -Ruta para actualizar un usuario
router.put('/user', isAuth ,controladorUser.updateUser);

// -Ruta para borrar un usuario;
router.post('/sayonara', isAuth ,controladorUser.deleteUser);

// -Ruta para crear una Room
router.get('/create', isAuth ,controladorRoom.createRoom);

// -Ruta para ver un streaming
router.get('/streaming', isAuth ,vista.vistaStreamer);

// -Ruta para unirse a una Room 
router.get('/room/:codigo', controladorRoom.joinRoom);

// -Ruta para actualizar el code de una Room
router.put('/refresh', isAuth , controladorRoom.updateCode);

// -Ruta para cambiar la contraseña
router.put('/password', isAuth ,controladorUser.changePassword);

// -Ruta para recuperar la contraseña
router.post('/recovering', isNotAuth ,controladorUser.recoveryPassword);

// -Ruta de confirmación de recuperación con el token
router.post('/recovery', controladorUser.confirmToken);

// WEBRTC - Codigo de Coding With Chaim adaptado a nuestro proyecto \/
let senderStream; 

function handleTrackEvent(e, peer) {
    senderStream = e.streams[0];
};

router.post("/consumer", async ({ body }, res) => {
    const peer = new webrtc.RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.stunprotocol.org"
            }
        ]
    });
    const desc = new webrtc.RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);

    // Verificar si senderStream está definido antes de utilizarlo
    if (senderStream) {
        senderStream.getTracks().forEach(track => peer.addTrack(track, senderStream));
    }

    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payload = {
        sdp: peer.localDescription
    }

    res.json(payload);
});

router.post('/broadcast', async ({ body }, res) => {
    const peer = new webrtc.RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.stunprotocol.org"
            }
        ]
    });
    peer.ontrack = (e) => handleTrackEvent(e, peer);
    const desc = new webrtc.RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);

    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payload = {
        sdp: peer.localDescription
    }

    res.json(payload);
});

// WebRTC - Codigo de Coding With Chaim adaptado a nuestro proyecto /\

// -Ruta para salir de una Room
router.post('/leave', controladorRoom.leaveRoom);

// - Ruta para destruir una Room
router.delete('/destroy', isAuth ,controladorRoom.deleteRoom);

// -Ruta para actualizar una Room
router.put('/room', isAuth ,controladorRoom.updateRoom);

// -Ruta para hacer privada una Room
router.put('/private', isAuth ,controladorRoom.makePrivate);

// -Ruta para banear a un usuario de una Room
router.put('/ban', isAuth ,controladorRoom.banUser);

// - Ruta desconocida
router.use((req, res, next) => {
    res.status(404).render('404', { title: '404' });
});

module.exports = router;
