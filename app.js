// Importamos cors
const cors = require('cors');
// Importamos express
const express = require('express');

// Importamos path
const path = require('path');

// Importamos express-ejs-layouts
const expressLayouts = require('express-ejs-layouts');

// Importamos las rutas
const router = require('./routes/routes.js');
const router2 = require('./routes/routes2.js');

// Usamos express
const app = express();

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

// Rutas2
// app.use(router2.router);

// Puerto
const port = 3000;

// Escuchamos el puerto
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
}
);


