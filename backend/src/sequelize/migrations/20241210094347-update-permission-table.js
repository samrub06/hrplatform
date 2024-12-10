'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Essayez ces différentes variantes selon le nom actuel de vos colonnes
    try {
    
      await queryInterface.renameColumn('permission', 'canDelete', 'can_delete');
      await queryInterface.renameColumn('permission', 'canEdit', 'can_edit');
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  },
}
  