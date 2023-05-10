// Importamos cors
const cors = require('cors');
// Importamos express
const express = require('express');
// Importamos las variables de entorno
require('dotenv').config();

// Importamos path
const path = require('path');

// Importamos la dependencia de cookies
const cookieParser = require('cookie-parser');

// Importamos express-ejs-layouts
const expressLayouts = require('express-ejs-layouts');

// Importamos las rutas
const router = require('./routes/routes.js');
const router2 = require('./routes/routes2.js');

// Usamos express
const app = express();

// Importamos body-parser
const bodyparser = require('body-parser');

// Usamos cookie-parser
app.use(cookieParser());

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

// Rutas
app.use('/', router);

// Puerto
const port = process.env.PORT || 3000;

// Escuchamos el puerto
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
}
);



