module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      { id: Sequelize.literal('uuid_generate_v4()'), name: 'CREATE_USER' },
      { id: Sequelize.literal('uuid_generate_v4()'), name: 'DELETE_USER' },
      { id: Sequelize.literal('uuid_generate_v4()'), name: 'UPDATE_USER' },
      { id: Sequelize.literal('uuid_generate_v4()'), name: 'GET_ALL_USERS' },
      { id: Sequelize.literal('uuid_generate_v4()'), name: 'GET_USER_BY_ID' },
      { id: Sequelize.literal('uuid_generate_v4()'), name: 'CREATE_JOB' },
      { id: Sequelize.literal('uuid_generate_v4()'), name: 'UPDATE_JOB' },
      { id: Sequelize.literal('uuid_generate_v4()'), name: 'GET_ALL_JOBS' },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        name: 'CREATE_ADMIN_NOTE',
      },
    ];

    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
    );
    await queryInterface.bulkInsert('Permission', permissions);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Permission', null, {});
  },
};
