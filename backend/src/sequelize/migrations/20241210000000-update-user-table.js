'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user', 'admin_noteId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'admin_note', // Nom de la table de référence
        key: 'id', // Clé primaire de la table de référence
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', // Ou 'CASCADE' selon votre logique
    });

    // Si vous souhaitez supprimer l'ancienne colonne AdminNote, décommentez la ligne suivante
    await queryInterface.removeColumn('user', 'adminNotes');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user', 'admin_noteId');
    // Si vous avez supprimé l'ancienne colonne AdminNote, vous pouvez la recréer ici
     await queryInterface.addColumn('user', 'adminNotes', {
       type: Sequelize.TEXT,
       allowNull: true,
     });
  }
};