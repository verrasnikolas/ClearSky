const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ReviewRequest = sequelize.define('ReviewRequest', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    gradeEntryId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
        defaultValue: 'PENDING'
    },
    response: {
        type: DataTypes.STRING
    }
});

module.exports = ReviewRequest;
