const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ReviewRequest = sequelize.define('ReviewRequest', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    student_id: {
        type: DataTypes.STRING, // or DataTypes.UUID if you're enforcing UUID format
        allowNull: false
    },
    course_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false
    },
    attachment: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
        defaultValue: 'PENDING'
    },
    response: {
        type: DataTypes.STRING
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ['student_id', 'course_id']
        }
    ]
});

module.exports = ReviewRequest;
