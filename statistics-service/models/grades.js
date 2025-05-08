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
}, {
    tableName: 'grades', // matches your actual table
    timestamps: false,
});

module.exports = Grade;
