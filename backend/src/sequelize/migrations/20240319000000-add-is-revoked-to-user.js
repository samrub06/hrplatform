'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user', 'isRevoked', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    // Ajout d'un index pour optimiser les requêtes sur isRevoked
    await queryInterface.addIndex('user', ['isRevoked'], {
      name: 'idx_user_is_revoked'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('user', 'idx_user_is_revoked');
    await queryInterface.removeColumn('user', 'isRevoked');
  }
}; 