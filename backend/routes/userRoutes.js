const express = require('express');
const router = express.Router();
const { getAllUsers, banUser, deleteUser } = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/auth');

router.use(protect, isAdmin);
router.get('/', getAllUsers);
router.patch('/:id/ban', banUser);
router.delete('/:id', deleteUser);

module.exports = router;
