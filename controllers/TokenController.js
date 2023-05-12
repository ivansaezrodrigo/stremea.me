// Importamos el modelo
const modeloToken = require("../models").Token;

// Metodos para el CRUD

// Metodo para crear un token
const createToken = async (req, res) => {
  try {
    // Creamos el token
    const newToken = await modeloToken.create({
      userid: req.body.userid,
      token: req.body.token,
      typetoken: req.body.typetoken,
    });
    // Devolvemos el token creado
    res.status(201).send(newToken);
  } catch (error) {
    res.status(500).send("Error al crear el token");
  }
};

// Metodo para obtener todos los tokens
const getAllTokens = async (req, res) => {
  try {
    const tokens = await modeloToken.findAll();
    res.status(200).send(tokens);
  } catch (error) {
    res.status(500).send("Error al obtener los tokens");
  }
};

// Metodo para obtener un token por su id
const getTokenById = async (req, res) => {
  try {
    const token = await modeloToken.findByPk(req.params.id);
    if (token) {
      res.status(200).send(token);
    } else {
      res.status(404).send("Token no encontrado");
    }
  } catch (error) {
    res.status(500).send("Error al obtener el token");
  }
};

// Metodo para actualizar un token
const updateToken = async (req, res) => {
  try {
    const token = await modeloToken.findByPk(req.params.id);
    if (token) {
      await token.update({
        userid: req.body.userid,
        token: req.body.token,
        typetoken: req.body.typetoken,
      });
      res.status(200).send(token);
    } else {
      res.status(404).send("Token no encontrado");
    }
  } catch (error) {
    res.status(500).send("Error al actualizar el token");
  }
};

// Metodo para borrar un token
const deleteToken = async (req, res) => {
  try {
    const token = await modeloToken.findByPk(req.params.id);
    if (token) {
      await token.destroy();
      res.status(200).send("Token borrado");
    } else {
      res.status(404).send("Token no encontrado");
    }
  } catch (error) {
    res.status(500).send("Error al borrar el token");
  }
};

module.exports = {
  createToken,
  getAllTokens,
  getTokenById,
  updateToken,
  deleteToken,
};