'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // create if no exists
    await queryInterface.createTable('role_permission', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      role_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'role',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      permission_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'permission',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // add composite index to avoid duplicates if no exists
    await queryInterface.addIndex(
      'role_permission',
      ['role_id', 'permission_id'],
      {
        unique: true,
        name: 'role_permission_unique',
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('role_permission');
  },
};
