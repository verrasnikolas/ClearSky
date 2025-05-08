'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      Course.hasMany(models.GradeEntry, {
        foreignKey: 'course_id',
        onDelete: 'CASCADE'
      });
    }
  }

  Course.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    semester: {
      type: DataTypes.STRING,
      allowNull: false
    },
    grading_scale: {
      type: DataTypes.STRING,
      defaultValue: '0-10'
    },
    question_weights: {
      type: DataTypes.JSONB,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Course',
    tableName: 'Courses',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['code', 'semester']
      }
    ]
  });

  return Course;
};
