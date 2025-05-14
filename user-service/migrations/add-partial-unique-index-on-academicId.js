'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            CREATE UNIQUE INDEX unique_academic_id_students
                ON users (academicId)
                WHERE role = 'student';
        `);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            DROP INDEX IF EXISTS unique_academic_id_students;
        `);
    }
};
