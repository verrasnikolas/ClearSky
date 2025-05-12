'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GradeEntries', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        allowNull: false,
        primaryKey: true
      },
      student_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      initial_grade: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      final_grade: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('initial', 'reviewed', 'finalized'),
        allowNull: false,
        defaultValue: 'initial'
      },
      course_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Courses',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      finalized_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
  });
    await queryInterface.addConstraint('GradeEntries', {
      fields: ['student_id', 'course_id'],
      type: 'unique',
      name: 'unique_grade_per_student'
    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('GradeEntries');
  }
};