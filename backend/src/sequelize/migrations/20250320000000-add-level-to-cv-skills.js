'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('cv_skills', 'level');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('cv_skills', 'level', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      after: 'yearsOfExperience',
    });
  },
}; 