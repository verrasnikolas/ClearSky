const { body, validationResult } = require('express-validator');
const User = require('../models/users');

// Custom validator for Academic ID (handle create/update cases)
const checkDuplicateAcademicId = (isUpdate = false) => {
    return body('academicId').custom(async (value, { req }) => {
        const user = await User.findOne({ where: { academicId: value } });
        if (user) {
            // In update, allow if it's the same user (same ID)
            if (isUpdate && user.id === parseInt(req.params.id)) {
                return true;
            }
            throw new Error('Academic ID already exists');
        }
        return true;
    });
};

// Validation rules for creating a user
const createUserValidationRules = [
    body('email')
        .isEmail().withMessage('Invalid email address')
        .normalizeEmail(),
    body('name')
        .notEmpty().withMessage('Name is required')
        .trim()
        .custom((value) => value.trim().length > 0)
        .withMessage('Name cannot be only whitespace'),
    body('academicId')
        .notEmpty().withMessage('Academic ID is required')
        .trim(),
    checkDuplicateAcademicId(false), // Check for duplicates in create
];

// Validation rules for updating a user
const updateUserValidationRules = [
    body('email')
        .optional()
        .isEmail().withMessage('Invalid email address')
        .normalizeEmail(),
    body('name')
        .optional()
        .custom((value) => value.trim().length > 0)
        .withMessage('Name cannot be only whitespace'),
    body('academicId')
        .optional()
        .trim(),
    checkDuplicateAcademicId(true), // Check for duplicates in update (but allow same user)
];

// Middleware to return validation errors
const validateUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    createUserValidationRules,
    updateUserValidationRules,
    validateUser,
};
