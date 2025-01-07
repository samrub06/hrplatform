'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user', 'years_experience', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'cv'  // Ajoute la colonne après la colonne 'cv'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user', 'years_experience');
  }
};