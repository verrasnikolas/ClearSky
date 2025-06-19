const { body, validationResult } = require('express-validator');
const User = require('../models/users');

const checkDuplicateAcademicId = () => {
    return body('academicId').custom(async (value, { req }) => {
        if (!value) return true;
        const user = await User.findOne({ where: { academicId: value } });
        if (user) {
            throw new Error('Academic ID already exists');
        }
        return true;
    });
};

const roleEnum = ['student', 'instructor', 'institution_representative'];

const createUserValidationRules = [
    body('email')
        .isEmail().withMessage('Invalid email address')
        .normalizeEmail()
        .custom(async (value) => {
            const user = await User.findOne({ where: { email: value } });
            if (user) {
                throw new Error('Email already in use');
            }
            return true;
        }),
    body('username')
        .custom((value, { req }) => {
            if (req.body.role !== 'student' && (!value || value.trim() === '')) {
                throw new Error('Username is required for non-students');
            }
            return true;
        })
        .custom(async (value) => {
            if (!value) return true; // ignore if student (auto-generated)
            const existing = await User.findOne({ where: { username: value } });
            if (existing) {
                throw new Error('Username already taken');
            }
            return true;
        }),
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('role').isIn(roleEnum).withMessage(`Role must be one of: ${roleEnum.join(', ')}`),
    body('academicId').custom((value, { req }) => {
        if (req.body.role === 'student' && (!value || value.trim() === '')) {
            throw new Error('Academic ID is required for students');
        }
        return true;
    }),
    checkDuplicateAcademicId(),
];

const updateUserValidationRules = [
    body('email')
        .optional()
        .isEmail().withMessage('Invalid email address')
        .normalizeEmail()
        .custom(async (value, { req }) => {
            const existing = await User.findOne({ where: { email: value } });
            if (existing && existing.id !== parseInt(req.params.id)) {
                throw new Error('Email already in use');
            }
            return true;
        }),
    body('name').optional().trim(),
    body('username')
        .optional()
        .trim()
        .custom(async (value, { req }) => {
            const existing = await User.findOne({ where: { username: value } });
            if (existing && existing.id !== parseInt(req.params.id)) {
                throw new Error('Username already taken');
            }
            return true;
        }),
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
    validateUser
};
