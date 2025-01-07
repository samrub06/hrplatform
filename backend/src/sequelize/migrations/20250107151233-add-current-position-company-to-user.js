'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user', 'current_position', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'years_experience'  // Ajoute la colonne après years_experience
    });

    await queryInterface.addColumn('user', 'current_company', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'current_position'  // Ajoute la colonne après current_position
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user', 'current_position');
    await queryInterface.removeColumn('user', 'current_company');
  }
};