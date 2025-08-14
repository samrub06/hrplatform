'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cv_experiences', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      cv_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'cv',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      company: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      isCurrent: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Add indexes for better performance
    await queryInterface.addIndex('cv_experiences', ['cv_id']);
    await queryInterface.addIndex('cv_experiences', ['company']);
    await queryInterface.addIndex('cv_experiences', ['isCurrent']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('cv_experiences');
  },
}; 