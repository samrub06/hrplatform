'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('user', 'role_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'role',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('user', 'role_id', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'role',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });
  }
}; 