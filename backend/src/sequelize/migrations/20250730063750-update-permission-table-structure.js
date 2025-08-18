'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add new columns if they don't exist (idempotent)
    const desc = await queryInterface.describeTable('permission');
    if (!desc.resource) {
      await queryInterface.addColumn('permission', 'resource', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'default',
      });
    }
    if (!desc.action) {
      await queryInterface.addColumn('permission', 'action', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'read',
      });
    }

    // Remove old columns
    if (desc.domain) await queryInterface.removeColumn('permission', 'domain');
    if (desc.can_read) await queryInterface.removeColumn('permission', 'can_read');
    if (desc.can_create) await queryInterface.removeColumn('permission', 'can_create');
    if (desc.can_edit) await queryInterface.removeColumn('permission', 'can_edit');
    if (desc.can_delete) await queryInterface.removeColumn('permission', 'can_delete');
  },

  async down(queryInterface, Sequelize) {
    // Add back old columns
    await queryInterface.addColumn('permission', 'domain', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'default',
    });

    await queryInterface.addColumn('permission', 'can_read', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });

    await queryInterface.addColumn('permission', 'can_create', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });

    await queryInterface.addColumn('permission', 'can_edit', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });

    await queryInterface.addColumn('permission', 'can_delete', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });

    // Remove new columns
    await queryInterface.removeColumn('permission', 'resource');
    await queryInterface.removeColumn('permission', 'action');
  },
};
