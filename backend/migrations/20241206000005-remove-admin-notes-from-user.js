module.exports = {
  up: async (queryInterface) => {
    await queryInterface.removeColumn('User', 'adminNotes');
  },
  down: async (queryInterface) => {
    await queryInterface.addColumn('User', 'adminNotes', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },
};
