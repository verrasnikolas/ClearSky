// routes/grades-routes.js
// focal point: /upload endpoint
const express = require('express');
const router = express.Router();
const gradesController = require('../controllers/grades-controller');
const { authenticate, authorize } = require('../middleware/authentication'); // Ανάλογα με την αυθεντικοποίηση σου
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // Αποθηκεύουμε το αρχείο στη μνήμη για να το στείλουμε στο microservice

router.post(
    '/upload',
    authenticate,
    authorize(['instructor']),
    upload.single('file'),
    gradesController.uploadInitialGrades
);

// ... routes for future endpoints here ...

module.exports = router;