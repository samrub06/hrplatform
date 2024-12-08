'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('User', 'skills', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: [],
    });

    await queryInterface.addColumn('User', 'desired_position', {
      type: Sequelize.JSONB,
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('User', 'skills');
    await queryInterface.removeColumn('User', 'desired_position');
  },
};
