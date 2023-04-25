// importamos el modelo
const modeloUser = require('../models').User;

// Metodos para el CRUD

// Metodo para crear un usuario
const createUser = async (req, res) => {
    try {
        // Comprobamos que el usuario no existe
        const user = await modeloUser.findOne({
            where: {
                email: req.body.email
            }
        });
        if (user) {
            // Si el usuario existe devolvemos un error
            res.status(400).send('El usuario ya existe');
        } else {
            // Creamos el usuario
            const newUser = await modeloUser.create({
                email: req.body.email,
                password: req.body.password,
                rol: 'user',
                newsletter: true
            });
            // Devolvemos el usuario creado
            res.status(201).send(newUser);
        }
    } catch (error) {
        res.status(500).send('Error al crear el usuario');
    }
};

// Metodo para obtener todos los usuarios
const getAllUsers = async (req, res) => {
    try {
        const users = await modeloUser.findAll();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send('Error al obtener los usuarios');
    }
};

// Metodo para obtener un usuario por su id
const getUserById = async (req, res) => {
    try {
        const user = await modeloUser.findByPk(req.params.id);
        if (user) {
            res.status(200).send(user);
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } catch (error) {
        res.status(500).send('Error al obtener el usuario');
    }
};

// Metodo para actualizar un usuario
const updateUser = async (req, res) => {
    try {
        const user = await modeloUser.findByPk(req.params.id);
        if (user) {
            await user.update({
                email: req.body.email,
                password: req.body.password,
                rol: req.body.rol,
                newsletter: req.body.newsletter
            });
            res.status(200).send(user);
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } catch (error) {
        res.status(500).send('Error al actualizar el usuario');
    }
};

// Metodo para borrar un usuario
const deleteUser = async (req, res) => {
    try {
        const user = await modeloUser.findByPk(req.params.id);
        if (user) {
            await user.destroy();
            res.status(200).send('Usuario borrado');
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } catch (error) {
        res.status(500).send('Error al borrar el usuario');
    }
};

// Metodo para darse de baja de la newsletter
const unsubscribeNewsletter = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await modeloUser.findByPk(userId);
        if (user) {
            await user.update({
                newsletter: false
            });
            res.status(200).send('Usuario dado de baja de la newsletter');
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } catch (error) {
        res.status(500).send('Error al darse de baja de la newsletter');
    }
};

// Metodo para darse de alta de la newsletter
const subscribeNewsletter = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await modeloUser.findByPk(userId);
        if (user) {
            await user.update({
                newsletter: true
            });
            res.status(200).send('Usuario dado de alta de la newsletter');
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } catch (error) {
        res.status(500).send('Error al darse de alta de la newsletter');
    }
};




module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    unsubscribeNewsletter,
    subscribeNewsletter
};