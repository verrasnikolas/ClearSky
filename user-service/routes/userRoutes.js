const express = require('express');
const router = express.Router();
const {addUser,getUserById, getUserByAcademicId, updateUser, changePassword, getUserByEmail } = require('../controllers/userController');
const { createUserValidationRules, updateUserValidationRules, validateUser } = require('../middlewares/verificationMiddleware');

router.post('/', [...createUserValidationRules, validateUser],addUser);

router.get('/:id', getUserById);

router.get('/academic/:academicId', getUserByAcademicId);

router.put('/:id', [...updateUserValidationRules, validateUser], updateUser);

router.patch('/:id/password', changePassword);

router.get('/email/:email', getUserByEmail);

module.exports = router;
