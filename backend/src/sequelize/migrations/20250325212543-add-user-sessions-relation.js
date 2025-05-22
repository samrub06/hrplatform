'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Ajout de la contrainte de clé étrangère
    await queryInterface.addConstraint('sessionUser', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_session_user_user',
      references: {
        table: 'user',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    // Ajout d'un index composite pour améliorer les performances des requêtes
    await queryInterface.addIndex('sessionUser', ['userId', 'isActive'], {
      name: 'idx_user_active_sessions'
    });
  },

  async down(queryInterface, Sequelize) {
    // Suppression de l'index
    await queryInterface.removeIndex('sessionUser', 'idx_user_active_sessions');
    
    // Suppression de la contrainte de clé étrangère
    await queryInterface.removeConstraint('sessionUser', 'fk_session_user_user');
  }
}; 