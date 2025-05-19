'use strict';
module.exports = (sequelize, DataTypes) => {
  const InitialGrade = sequelize.define('InitialGrade', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
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
    }
  }, {
    tableName: 'initial_grades',
    timestamps: false,
    uniqueKeys: {
      unique_student_course: {
        fields: ['student_id', 'course_id']
      }
    }
  });

  InitialGrade.associate = (models) => {
    InitialGrade.belongsTo(models.Course, {
      foreignKey: 'course_id',
      onDelete: 'CASCADE'
    });
  };

  return InitialGrade;
};
