'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Création des permissions
      const permissions = [
        // Permissions pour le domaine User
        { 
          id: uuidv4(), 
          domain: 'User', 
          name: "ReadUser", 
          can_create: false, 
          can_read: true, 
          can_edit: false, 
          can_delete: false, 
          createdAt: new Date(), 
          updatedAt: new Date() 
        },
        { 
          id: uuidv4(), 
          domain: 'User', 
          name: "EditUser", 
          can_create: false, 
          can_read: true, 
          can_edit: true, 
          can_delete: false, 
          createdAt: new Date(), 
          updatedAt: new Date() 
        },
        { 
          id: uuidv4(), 
          domain: 'User', 
          name: "FullAccessUser", 
          can_create: true, 
          can_read: true, 
          can_edit: true, 
          can_delete: true, 
          createdAt: new Date(), 
          updatedAt: new Date() 
        },
        
        // Permissions pour le domaine Job
        { 
          id: uuidv4(), 
          domain: 'Job', 
          name: "ReadJob", 
          can_create: false, 
          can_read: true, 
          can_edit: false, 
          can_delete: false, 
          createdAt: new Date(), 
          updatedAt: new Date() 
        },
        { 
          id: uuidv4(), 
          domain: 'Job', 
          name: "CreateJob", 
          can_create: true, 
          can_read: true, 
          can_edit: false, 
          can_delete: false, 
          createdAt: new Date(), 
          updatedAt: new Date() 
        },
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
        }
      ];

      await queryInterface.bulkInsert('permission', permissions);
      console.log('Permissions insérées avec succès');

      // Création des rôles
      const roles = [
        { id: uuidv4(), name: 'candidate', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), name: 'publisher', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), name: 'admin', createdAt: new Date(), updatedAt: new Date() }
      ];

      await queryInterface.bulkInsert('role', roles);
      console.log('Rôles insérés avec succès');

      // Récupération des IDs des permissions et rôles insérés
      const [savedPermissions, savedRoles] = await Promise.all([
        queryInterface.sequelize.query('SELECT id, name, domain FROM permission'),
        queryInterface.sequelize.query('SELECT id, name FROM role')
      ]);

      // Création de maps pour faciliter l'accès aux IDs
      const permissionsMap = savedPermissions[0].reduce((acc, curr) => {
        acc[`${curr.domain}_${curr.name}`] = curr.id;
        return acc;
      }, {});

      const rolesMap = savedRoles[0].reduce((acc, curr) => {
        acc[curr.name] = curr.id;
        return acc;
      }, {});

      // Attribution des permissions aux rôles
      const rolePermissions = [
        // Permissions pour le rôle candidate
        {
          id: uuidv4(),
          role_id: rolesMap.candidate,
          permission_id: permissionsMap.User_EditUser,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          role_id: rolesMap.candidate,
          permission_id: permissionsMap.Job_ReadJob,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        
        // Permissions pour le rôle publisher
        {
          id: uuidv4(),
          role_id: rolesMap.publisher,
          permission_id: permissionsMap.User_ReadUser,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          role_id: rolesMap.publisher,
          permission_id: permissionsMap.Job_CreateJob,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          role_id: rolesMap.publisher,
          permission_id: permissionsMap.Job_FullAccessJob,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        
        // Permissions pour le rôle admin (accès complet)
        {
          id: uuidv4(),
          role_id: rolesMap.admin,
          permission_id: permissionsMap.User_FullAccessUser,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          role_id: rolesMap.admin,
          permission_id: permissionsMap.Job_FullAccessJob,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      await queryInterface.bulkInsert('role_permission', rolePermissions);
      console.log('Associations rôle-permission insérées avec succès');

      return Promise.resolve();
    } catch (error) {
      console.error('Erreur lors du seeding:', error);
      return Promise.reject(error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Suppression des données dans l'ordre inverse pour respecter les contraintes de clé étrangère
    await queryInterface.bulkDelete('role_permission', null, {});
    await queryInterface.bulkDelete('permission', null, {});
    await queryInterface.bulkDelete('role', null, {});
  }
}; 