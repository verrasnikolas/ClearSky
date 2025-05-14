const { body, validationResult } = require('express-validator');
const User = require('../models/users');

const checkDuplicateAcademicId = (isUpdate = false) => {
    return body('academicId').custom(async (value, { req }) => {
        if (!value) return true; // Skip if not provided
        const user = await User.findOne({ where: { academicId: value } });
        if (user) {
            if (isUpdate && user.id === parseInt(req.params.id)) {
                return true;
            }
            throw new Error('Academic ID already exists');
        }
        return true;
    });
};

const roleEnum = ['student', 'instructor', 'institution_representative'];

const createUserValidationRules = [
    body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('role').isIn(roleEnum).withMessage(`Role must be one of: ${roleEnum.join(', ')}`),
    body('academicId').custom((value, { req }) => {
        if (req.body.role === 'student' && (!value || value.trim() === '')) {
            throw new Error('Academic ID is required for students');
        }
        return true;
    }),
    checkDuplicateAcademicId(false),
];

const updateUserValidationRules = [
    body('email').optional().isEmail().withMessage('Invalid email').normalizeEmail(),
    body('name').optional().trim(),
    body('role').optional().isIn(roleEnum).withMessage(`Role must be one of: ${roleEnum.join(', ')}`),
    body('academicId').optional(),
    checkDuplicateAcademicId(true),
];

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
