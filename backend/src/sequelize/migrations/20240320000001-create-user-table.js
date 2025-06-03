'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      profilePicture: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      desired_position: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      current_position: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      current_company: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      years_experience: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      salary_expectation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      public_link_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isRevoked: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      role_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'role',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      github_link: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      linkedin_link: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      birthday: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      googleId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      linkedinId: {
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user');
  },
};
