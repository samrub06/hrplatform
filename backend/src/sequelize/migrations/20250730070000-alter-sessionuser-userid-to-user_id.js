'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = 'sessionUser';
    // If old column exists, rename it to snake_case to match model field mapping
    const tableDesc = await queryInterface.describeTable(table);
    if (tableDesc.userId && !tableDesc.user_id) {
      await queryInterface.renameColumn(table, 'userId', 'user_id');
    }
  },

  async down(queryInterface, Sequelize) {
    const table = 'sessionUser';
    const tableDesc = await queryInterface.describeTable(table);
    if (tableDesc.user_id && !tableDesc.userId) {
      await queryInterface.renameColumn(table, 'user_id', 'userId');
    }
  },
};

