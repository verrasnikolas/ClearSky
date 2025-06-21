'use strict';

const {hash} = require("bcrypt");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()')
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      academicId: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      role: {
        type: Sequelize.ENUM('student', 'instructor', 'institution_representative, admin'),
        allowNull: false,
        defaultValue: 'student'
      },
      forcePasswordReset: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
    const hashedPassword = await hash('123', 10);
    await queryInterface.bulkInsert('users', [{
      id: '95316cc3-85c8-4ac5-9541-0a242d43b749',
      username: 'admin',
      password: hashedPassword,
      email: 'admin@example.com',
      name: 'Administrator',
      academicId: null,
      role: 'admin',
      forcePasswordReset: false
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { username: 'admin' }, {});
    await queryInterface.dropTable('users');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_role";');
  }
};
