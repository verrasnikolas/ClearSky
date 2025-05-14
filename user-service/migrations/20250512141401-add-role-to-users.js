'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('users', 'role', {
            type: Sequelize.ENUM('student', 'instructor', 'institution_representative'),
            allowNull: false,
            defaultValue: 'student'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('users', 'role');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_role";');  // Καθαρίζεις και το ENUM type
    }
};
