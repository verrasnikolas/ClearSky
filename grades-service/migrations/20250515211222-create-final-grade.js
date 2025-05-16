'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('final_grades', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()') // or use UUIDV4 in model only
      },
      student_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      course_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'courses',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      grade: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      question_grades: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      reviewed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      initial_grade_id: {
        type: Sequelize.UUID,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('final_grades');
  }
};
