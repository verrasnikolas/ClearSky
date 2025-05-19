'use strict';

module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    code: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    semester: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    grading_scale: {
      type: DataTypes.TEXT,
      defaultValue: '0-10',
    },
    question_weights: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    instructor_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    initial_grades_submission_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    final_grades_submission_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'courses',
    timestamps: false,
    uniqueKeys: {
      unique_code_semester: {
        fields: ['code', 'semester'],
      }
    }
  });

  Course.associate = (models) => {

    Course.hasMany(models.InitialGrade, {
      foreignKey: 'course_id',
      onDelete: 'CASCADE'
    });

  };

  return Course;
};
