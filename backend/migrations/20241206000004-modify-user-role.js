module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Supprimer l'ancienne colonne role
    await queryInterface.removeColumn('User', 'role');

    // Ajouter la nouvelle colonne roleId
    await queryInterface.addColumn('User', 'roleId', {
      type: Sequelize.UUID,
      references: {
        model: 'Role',
        key: 'id',
      },
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    // Restaurer l'ancienne colonne role
    await queryInterface.addColumn('User', 'role', {
      type: Sequelize.ENUM,
      values: ['user', 'admin', 'viewer', 'super_admin'],
    });

    // Supprimer la colonne roleId
    await queryInterface.removeColumn('User', 'roleId');
  },
};
