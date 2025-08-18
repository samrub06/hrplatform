'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = 'sessionUser';
    // Change column type to TEXT to fit long JWTs
    await queryInterface.changeColumn(table, 'token', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    const table = 'sessionUser';
    await queryInterface.changeColumn(table, 'token', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};

