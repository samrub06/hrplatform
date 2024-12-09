module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RolePermission', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      roleId: {
        type: Sequelize.UUID,
        references: {
          model: 'Role',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      permissionId: {
        type: Sequelize.UUID,
        references: {
          model: 'Permission',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('RolePermission');
  },
};
