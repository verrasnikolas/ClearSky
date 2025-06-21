const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
    type: DataTypes.STRING,
        allowNull: false,
},
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    academicId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: DataTypes.ENUM('student', 'instructor', 'institution_representative', 'admin'),
        allowNull: false,
    },
    forcePasswordReset: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'users',
    timestamps: false,
    validate: {
        studentMustHaveAcademicId() {
            if (this.role === 'student' && !this.academicId) {
                throw new Error('Students must have an academicId');
            }
        }
    }
});

module.exports = User;
