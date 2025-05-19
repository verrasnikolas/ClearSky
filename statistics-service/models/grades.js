// models/Grade.js (No changes needed for the current scope)
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Grade = sequelize.define('Grade', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    grade: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    course: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    studentId: { // Assuming you have a studentId
        type: DataTypes.STRING,
        allowNull: false,
    },
    questions: { // Add this column
        type: DataTypes.JSONB,
        allowNull: true,
    },
}, {
    tableName: 'grades', // matches your actual table
    timestamps: false,
});

module.exports = Grade;