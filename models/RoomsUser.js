'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoomsUsers extends Model {
    static associate(models) {
      RoomsUsers.belongsTo(models.User, {
        foreignKey: 'userId'
      });
      RoomsUsers.belongsTo(models.Room, {
        foreignKey: 'roomId'
      });
    }
  };
  RoomsUsers.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    roomId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Rooms',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    banned: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'RoomsUsers',
  });
  return RoomsUsers;
};
