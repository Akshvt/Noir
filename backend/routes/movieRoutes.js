const express = require('express');
const router = express.Router();
const { createMovie, getMovies, getMovie, updateMovie, deleteMovie } = require('../controllers/movieController');
const { protect, isAdmin } = require('../middleware/auth');

router.get('/', getMovies);
router.get('/:id', getMovie);
router.post('/', protect, isAdmin, createMovie);
router.put('/:id', protect, isAdmin, updateMovie);
router.delete('/:id', protect, isAdmin, deleteMovie);

module.exports = router;
