'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('initial_grades', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()') // or UUIDV4 if preferred
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
      batch_id: {
        type: Sequelize.STRING, // Use STRING to accommodate your current batchId format (e.g., 'initial-12345-abcde')
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('initial_grades');
  }
};
