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
        courseName: { // Add the courseName field
            type: DataTypes.STRING,
            allowNull: true, // Adjust allowNull based on your requirements
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
        questionAverages: { // Add this field to store average question scores
            type: DataTypes.JSONB,
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