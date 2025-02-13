'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('user', 'linkedinId', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'googleId'
    });
    await queryInterface.addIndex('user', ['linkedinId'], {
      name: 'idx_user_linkedin_id'
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeIndex('user', 'idx_user_linkedin_id');
    await queryInterface.removeColumn('user', 'linkedinId');
  }
};
