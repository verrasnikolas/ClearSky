'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('courses', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()') // Optional: or use Sequelize.UUIDV4
      },
      code: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: 'unique_code_semester'
      },
      title: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      semester: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: 'unique_code_semester'
      },
      grading_scale: {
        type: Sequelize.TEXT,
        defaultValue: '0-10',
      },
      question_weights: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      instructor_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      initial_grades_submission_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      final_grades_submission_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('courses');
  }
};
