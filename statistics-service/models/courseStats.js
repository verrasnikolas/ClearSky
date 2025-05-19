// models/courseStats.js
module.exports = (sequelize, DataTypes) => {
    const CourseStats = sequelize.define('CourseStats', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        courseCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        courseName: {
            type: DataTypes.STRING,
            allowNull: true,
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
            type: DataTypes.JSONB,
            allowNull: true,
        },
        questionAverages: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
        questionDistributions: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
        passCount: {      // New field for pass count
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        notPassCount: {   // New field for not pass count
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        tableName: 'course_stats',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['courseCode', 'semester']
            }
        ]
    });

    return CourseStats;
};