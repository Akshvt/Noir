const express = require('express');
const router = express.Router();
const { addToHistory, getHistory } = require('../controllers/watchHistoryController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getHistory);
router.post('/', addToHistory);

module.exports = router;
