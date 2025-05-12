'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class QuestionGrade extends Model {
    static associate(models) {
      QuestionGrade.belongsTo(models.GradeEntry, {
        foreignKey: 'grade_entry_id',
        onDelete: 'CASCADE'
      });
    }
  }

  QuestionGrade.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    grade_entry_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    question_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    initial_score: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    final_score: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('initial', 'reviewed', 'finalized'),
      allowNull: false,
      defaultValue: 'initial'
    }
  }, {
    sequelize,
    modelName: 'QuestionGrade',
    tableName: 'QuestionGrades',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['grade_entry_id', 'question_id']
      }
    ]
  });

  return QuestionGrade;
};
