'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('cv', 's3_url', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('cv', 'file_size', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('cv', 'mime_type', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('cv', 'ocr_processed', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn('cv', 'ocr_raw_data', {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('cv', 's3_url');
    await queryInterface.removeColumn('cv', 'file_size');
    await queryInterface.removeColumn('cv', 'mime_type');
    await queryInterface.removeColumn('cv', 'ocr_processed');
    await queryInterface.removeColumn('cv', 'ocr_raw_data');
  }
}; 