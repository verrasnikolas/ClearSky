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