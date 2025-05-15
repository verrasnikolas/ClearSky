const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CourseStats = sequelize.define('CourseStats', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    courseCode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    semester: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    averageGrade: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    gradeDistribution: {
        type: DataTypes.JSONB, // Store the distribution as a JSON object
        allowNull: true,
    },
}, {
    tableName: 'course_stats',
    timestamps: true, // Add createdAt and updatedAt fields
    indexes: [
        {
            unique: true,
            fields: ['courseCode', 'semester']
        }
    ]
});

module.exports = CourseStats;