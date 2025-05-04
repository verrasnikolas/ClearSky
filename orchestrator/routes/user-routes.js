// routes/user-routes.js
// routes for anything related to users
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const { authenticate, authorize } = require('../middleware/authentication'); // demo middleware

router.post('/', userController.createUser);
router.get('/:id', authenticate, authorize(['admin', 'user']), userController.getUser);
// ... more routes here ...

module.exports = router;