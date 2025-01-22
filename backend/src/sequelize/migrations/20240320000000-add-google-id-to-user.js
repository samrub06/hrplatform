'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user', 'googleId', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'birthday'  // Ajoute la colonne après birthday
    });

    // Ajout d'un index pour optimiser les recherches par googleId
    await queryInterface.addIndex('user', ['googleId'], {
      name: 'idx_user_google_id'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('user', 'idx_user_google_id');
    await queryInterface.removeColumn('user', 'googleId');
  }
}; 