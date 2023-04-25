'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.hasMany(models.Token, {
        foreignKey: 'userid'
      })
      User.belongsToMany(models.Room, {
        through: 'RoomsUsers',
        foreignKey: 'userId'
      });
    }
  };
  User.init({
    alias: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    rol: DataTypes.STRING,
    twitter: DataTypes.STRING,
    instagram: DataTypes.STRING,
    twitch: DataTypes.STRING,
    url: DataTypes.STRING,
    newsletter: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};