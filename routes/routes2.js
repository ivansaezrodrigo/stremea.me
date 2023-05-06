const express = require('express');
const vistas = require('../controllers/ViewController');

const router = express.Router();


// router.get('/', vistas.vistaPrincipal);
router.get('/', vistas.vistaLanding);

router.use((req, res, next) => {
    res.status(404).render('404', { title: '404' });
});


module.exports = {
    router: router
};