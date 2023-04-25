// Importamos cors
const cors = require('cors');
// Importamos express
const express = require('express');

// Importamos las rutas
const router = require('./routes/routes.js');

// Usamos express
const app = express();

// Middleware para poder usar cors
app.use(cors());
app.use(express.json());

// Rutas
app.use('/', router);

// Puerto
const port = 3000;

// Escuchamos el puerto
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
}
);


