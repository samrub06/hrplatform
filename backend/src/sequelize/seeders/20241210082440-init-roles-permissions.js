'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Création des permissions

    const permissions = [
      // Permissions pour Publisher
      { id: uuidv4(), domain: 'Job', name: "FullAccessJob", can_create: true, can_read: true, can_edit: true, can_delete: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), domain: 'User', name: "ReadAccessUser",can_edit: false, can_create: false, can_read: true, can_delete: false, createdAt: new Date(), updatedAt: new Date() },
      // Permissions pour Candidate
      { id: uuidv4(), domain: 'User', name: 'FullAccessUser', can_create: true, can_edit: true, can_read: true, can_edit: true, can_delete: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), domain: 'User', name: 'EditAccessUser', can_create: false, can_delete: false, can_read: true, can_edit: true, can_delete: true, createdAt: new Date(), updatedAt: new Date() }
    ];


    await queryInterface.bulkInsert('permission', permissions);

    // Création des rôles
    const roles = [
      { id: uuidv4(), name: 'publisher', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'candidate', createdAt: new Date(), updatedAt: new Date() }
    ];
    await queryInterface.bulkInsert('role', roles);

    // Attribution des permissions aux rôles
    const [savedPermissions, savedRoles] = await Promise.all([
      queryInterface.sequelize.query('SELECT id, name FROM permission'),
      queryInterface.sequelize.query('SELECT id, name FROM role')
    ]);

    const permissionsMap = savedPermissions[0].reduce((acc, curr) => {
      acc[curr.name] = curr.id;
      return acc;
    }, {});

    const rolesMap = savedRoles[0].reduce((acc, curr) => {
      acc[curr.name] = curr.id;
      return acc;
    }, {});

    // Configuration des permissions par rôle
    const rolePermissions = [
      // Permissions pour Publisher
      {
        id: uuidv4(),
        roleId: rolesMap.publisher,
        permissionId: permissionsMap.ReadAccessUser,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        roleId: rolesMap.publisher,
        permissionId: permissionsMap.FullAccessJob,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        roleId: rolesMap.candidate,
        permissionId: permissionsMap.EditAccessUser,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('role_permission', rolePermissions);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('role_permission', null, {});
    await queryInterface.bulkDelete('permission', null, {});
    await queryInterface.bulkDelete('role', null, {});
  }
};