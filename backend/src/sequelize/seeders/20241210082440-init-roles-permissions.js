'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Création des permissions
      const permissions = [
        // Permissions pour Publisher
        { 
          id: uuidv4(), 
          domain: 'Job', 
          name: "FullAccessJob", 
          can_create: true, 
          can_read: true, 
          can_edit: true, 
          can_delete: true, 
          createdAt: new Date(), 
          updatedAt: new Date() 
        },
        { 
          id: uuidv4(), 
          domain: 'User', 
          name: "ReadAccessUser",
          can_edit: false, 
          can_create: false, 
          can_read: true, 
          can_delete: false, 
          createdAt: new Date(), 
          updatedAt: new Date() 
        },
        // Permissions pour Candidate
        { 
          id: uuidv4(), 
          domain: 'User', 
          name: 'EditAccessUser', 
          can_create: false, 
          can_delete: false, 
          can_read: true, 
          can_edit: true, 
          createdAt: new Date(), 
          updatedAt: new Date() 
        }
      ];

      await queryInterface.bulkInsert('permission', permissions);

      // Création des rôles avec les noms exacts
      const roles = [
        { id: uuidv4(), name: 'candidate', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), name: 'publisher', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), name: 'admin', createdAt: new Date(), updatedAt: new Date() }
      ];

      console.log('Inserting roles:', roles);
      await queryInterface.bulkInsert('role', roles);

      // Vérification immédiate
      const insertedRoles = await queryInterface.sequelize.query(
        'SELECT * FROM role',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      console.log('Inserted roles:', insertedRoles);

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

      const rolePermissions = [
        {
          id: uuidv4(),
          role_id: rolesMap.publisher,
          permission_id: permissionsMap.ReadAccessUser,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          role_id: rolesMap.publisher,
          permission_id: permissionsMap.FullAccessJob,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          role_id: rolesMap.candidate,
          permission_id: permissionsMap.EditAccessUser,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      await queryInterface.bulkInsert('role_permission', rolePermissions);
    } catch (error) {
      console.error('Error in seeder:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('role_permission', null, {});
    await queryInterface.bulkDelete('permission', null, {});
    await queryInterface.bulkDelete('role', null, {});
  }
};