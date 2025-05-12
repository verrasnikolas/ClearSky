'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('QuestionGrades', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        allowNull: false,
        primaryKey: true
      },
      grade_entry_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'GradeEntries',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      question_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      initial_score: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      final_score: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('initial', 'reviewed', 'finalized'),
        allowNull: false,
        defaultValue: 'initial'
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

    await queryInterface.addConstraint('QuestionGrades', {
      fields: ['grade_entry_id', 'question_id'],
      type: 'unique',
      name: 'unique_question_per_entry'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('QuestionGrades');
  }
};
