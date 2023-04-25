'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Token.belongsTo(models.User, {
        foreignKey: 'userid',
        targetKey: 'id'
      })
    }
  }
  Token.init({
    userid: DataTypes.INTEGER,
    token: DataTypes.STRING,
    typetoken: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Token',
  });
  return Token;
};