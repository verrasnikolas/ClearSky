'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('course_stats');
    if (!tableInfo.passCount) {
      await queryInterface.addColumn('course_stats', 'passCount', {
        type: Sequelize.INTEGER,
        allowNull: true
      });
    }
    if (!tableInfo.notPassCount) {
      await queryInterface.addColumn('course_stats', 'notPassCount', {
        type: Sequelize.INTEGER,
        allowNull: true
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('course_stats', 'passCount');
    await queryInterface.removeColumn('course_stats', 'notPassCount');
  }
};