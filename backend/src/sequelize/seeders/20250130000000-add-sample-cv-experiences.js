'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Get a sample CV ID (you'll need to adjust this based on your existing data)
    const cvResult = await queryInterface.sequelize.query(
      'SELECT id FROM cv LIMIT 1',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (cvResult.length > 0) {
      const cvId = cvResult[0].id;
      
      await queryInterface.bulkInsert('cv_experiences', [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          cv_id: cvId,
          title: 'Frontend Developer',
          company: 'Tech Solutions Inc.',
          startDate: new Date('2020-01-01'),
          endDate: null,
          isCurrent: true,
          description: 'Developed React applications with TypeScript. Worked on user interface improvements and performance optimization.',
          location: 'Paris, France',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          cv_id: cvId,
          title: 'Junior Developer',
          company: 'StartupXYZ',
          startDate: new Date('2018-06-01'),
          endDate: new Date('2019-12-31'),
          isCurrent: false,
          description: 'Built web applications using modern JavaScript frameworks. Collaborated with design and backend teams.',
          location: 'Lyon, France',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          cv_id: cvId,
          title: 'Intern Developer',
          company: 'BigCorp',
          startDate: new Date('2018-01-01'),
          endDate: new Date('2018-05-31'),
          isCurrent: false,
          description: 'Assisted senior developers with frontend development tasks. Learned React and modern web development practices.',
          location: 'Marseille, France',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('cv_experiences', null, {});
  },
}; 