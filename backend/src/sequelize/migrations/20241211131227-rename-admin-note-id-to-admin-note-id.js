'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('user', 'admin_noteId', 'admin_note_id');
    await queryInterface.removeColumn('user', 'AdminNoteId');

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('user', 'admin_note_id', 'admin_noteId');
  }
};
