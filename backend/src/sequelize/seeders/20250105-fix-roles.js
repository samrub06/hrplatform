'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Supprimons d'abord les rôles existants
    await queryInterface.bulkDelete('role', null, {});

    // Réinsérons les rôles avec les bons noms
    const roles = [
      { 
        id: uuidv4(), 
        name: 'candidate', 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        id: uuidv4(), 
        name: 'publisher', 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        id: uuidv4(), 
        name: 'admin', 
        createdAt: new Date(), 
        updatedAt: new Date() 
      }
    ];

    await queryInterface.bulkInsert('role', roles);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('role', null, {});
  }
}; 