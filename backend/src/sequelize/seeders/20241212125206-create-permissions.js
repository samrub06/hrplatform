'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      {
        id: uuidv4(),
        name: 'FullAccessPermission',
        domain: 'Permission',
        can_read: true,
        can_create: true,
        can_edit: true,
        can_delete: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Permission',
        domain: 'Permission',
        can_read: true,
        can_create: false,
        can_edit: false,
        can_delete: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'FullAdminAccess',
        domain: 'Admin',
        can_read: true,
        can_create: true,
        can_edit: true,
        can_delete: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('permission', permissions);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('permission', null, {});
  },
};