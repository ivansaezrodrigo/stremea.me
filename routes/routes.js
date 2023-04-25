// importamos express
const express = require('express');
const router = express.Router();

// Importamos los controladores
const controladorUser = require('../controllers/UserController');

// Ruta raiz
router.get('/', (req, res) => {
    res.send('Futuro stremea.me!');
});

// Ruta para darse de alta en la plataforma
router.post('/signup', controladorUser.createUser);

// Ruta para obtener un usuario por su id
router.get('/user/:id', controladorUser.getUserById);

// Ruta para actualizar un usuario
router.put('/user/:id', controladorUser.updateUser);

// Ruta para borrar un usuario
router.delete('/user/:id', controladorUser.deleteUser);

module.exports = router;
