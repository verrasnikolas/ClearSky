'use strict';

module.exports = (sequelize, DataTypes) => {
  const FinalGrade = sequelize.define('FinalGrade', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    student_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    course_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    grade: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    question_grades: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    reviewed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'final_grades',
    timestamps: false,
    uniqueKeys: {
      unique_student_course: {
        fields: ['student_id', 'course_id']
      }
    }
  });

  FinalGrade.associate = models => {
    FinalGrade.belongsTo(models.Course, {
      foreignKey: 'course_id',
      onDelete: 'CASCADE'
    });
  };



  return FinalGrade;
};
