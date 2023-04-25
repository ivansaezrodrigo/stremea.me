const express = require('express');
const app = express();
// Importamos los modelos con los que vamos a trabajar
const modeloRoom = require('./models').Room;
const modeloUser = require('./models').User;
const modeloToken = require('./models').Token;
const modeloRoomsUsers = require('./models').RoomsUsers;

// Importamos el controlador de usuarios
const userController = require('./controllers/UserController');


// Middleware para poder usar o body-parser es decir poder usar el req.body en las rutas 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Ruta que usa el controlador para crear un usuario
app.post('/signup', userController.createUser);



app.get('/', (req, res) => {
    res.send('Futuro stremea.me!');
});


app.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000');
    }
);