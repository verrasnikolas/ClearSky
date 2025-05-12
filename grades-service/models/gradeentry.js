'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class GradeEntry extends Model {
    static associate(models) {
      // FK associations
      GradeEntry.belongsTo(models.Course, {
        foreignKey: 'course_id',
        onDelete: 'CASCADE'
      });

      GradeEntry.hasMany(models.QuestionGrade, {
        foreignKey: 'grade_entry_id',
        onDelete: 'CASCADE'
      });
    }
  }

  GradeEntry.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    student_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    initial_grade: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    final_grade: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('initial', 'reviewed', 'finalized'),
      defaultValue: 'initial',
      allowNull: false
    },
    course_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    finalized_at: {
      type: DataTypes.DATE,
      allowNull: true
    }

  }, {
    sequelize,
    modelName: 'GradeEntry',
    tableName: 'GradeEntries', // optional: makes table name predictable
    timestamps: true,           // enables createdAt / updatedAt
    indexes: [
      {
        unique: true,
        fields: ['student_id', 'course_id']
      }
    ]
  });

  return GradeEntry;
};
