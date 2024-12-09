module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Job', 'userId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'User',
        key: 'id',
      },
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('Job', 'userId');
  },
};
