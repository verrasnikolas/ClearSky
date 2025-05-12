const express = require('express');
const router  = express.Router();
const uc      = require('../controllers/userController');

router.post('/', uc.addUser);                              // POST   /users
router.get('/:id', uc.getUserById);                         // GET    /users/:id
router.get('/academic/:academicid', uc.getUserByAcademicId); // GET   /users/academic/:academicid
router.put('/:id', uc.updateUser);                          // PUT    /users/:id

module.exports = router;
