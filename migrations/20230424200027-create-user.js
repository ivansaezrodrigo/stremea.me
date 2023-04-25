'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      alias: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      rol: {
        type: Sequelize.STRING,
        allowNull: false
      },
      twitter: {
        type: Sequelize.STRING,
        allowNull: true
      },
      instagram: {
        type: Sequelize.STRING,
        allowNull: true
      },
      twitch: {
        type: Sequelize.STRING,
        allowNull: true
      },
      url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      newsletter: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};