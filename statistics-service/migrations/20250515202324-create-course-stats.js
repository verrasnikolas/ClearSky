// migrations/xxxx-create-course-stats.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('course_stats', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()')
      },
      courseCode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      courseName: { // ADD THIS LINE
        type: Sequelize.STRING,
        allowNull: true
      },
      semester: {
        type: Sequelize.STRING,
        allowNull: false
      },
      averageGrade: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      gradeDistribution: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      questionAverages: { // ADD THIS LINE
        type: Sequelize.JSONB,
        allowNull: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('course_stats');
  }
};