const express = require('express');
const router = express.Router();
const { addFavorite, removeFavorite, getFavorites, checkFavorite } = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getFavorites);
router.post('/', addFavorite);
router.get('/check/:tmdbId', checkFavorite);
router.delete('/:tmdbId', removeFavorite);

module.exports = router;
