'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user', 'birthday', {
      type: Sequelize.DATE,
      allowNull: true,
      after: 'linkedin_link'  // Ajoute la colonne après linkedin_link
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user', 'birthday');
  }
}; 