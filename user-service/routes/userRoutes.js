const express = require('express');
const router = express.Router();
const {addUser,getUserById, getUserByAcademicId, updateUser, changePassword, getUserByEmail } = require('../controllers/userController');
const { createUserValidationRules, updateUserValidationRules, validateUser } = require('../middlewares/verificationMiddleware');
const { authenticateToken } = require('../middlewares/authToken');
// Create User
router.post('/', authenticateToken, [...createUserValidationRules, validateUser],addUser);

// Get User by ID
router.get('/:id' ,getUserById);

// Get User by Academic ID
router.get('/academic/:academicId', getUserByAcademicId);

// Update User
router.put('/:id', authenticateToken, [...updateUserValidationRules, validateUser], updateUser);

router.patch('/:id/password', authenticateToken, changePassword);

router.get('/email/:email', authenticateToken, getUserByEmail);

module.exports = router;

