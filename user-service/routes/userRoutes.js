const express = require('express');
const router = express.Router();
const uc = require('../controllers/userController');
const { createUserValidationRules, updateUserValidationRules, validateUser } = require('../middlewares/verificationMiddleware');

// Create User
router.post('/', [...createUserValidationRules, validateUser], uc.addUser);

// Get User by ID
router.get('/:id', uc.getUserById);

// Get User by Academic ID
router.get('/academic/:academicId', uc.getUserByAcademicId);

// Update User
router.put('/:id', [...updateUserValidationRules, validateUser], uc.updateUser);

router.patch('/:id/password', uc.changePassword);

router.get('/email/:email', uc.getUserByEmail);

module.exports = router;

