'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'permission',
      [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'Read User Profile',
          resource: 'user',
          action: 'read',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          name: 'Update User Profile',
          resource: 'user',
          action: 'update',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          name: 'Create User',
          resource: 'user',
          action: 'create',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440004',
          name: 'Delete User',
          resource: 'user',
          action: 'delete',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440005',
          name: 'Read CV',
          resource: 'cv',
          action: 'read',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440006',
          name: 'Update CV',
          resource: 'cv',
          action: 'update',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440007',
          name: 'Create CV',
          resource: 'cv',
          action: 'create',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440008',
          name: 'Delete CV',
          resource: 'cv',
          action: 'delete',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('permission', null, {});
  },
};
