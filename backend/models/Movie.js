const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    posterUrl: { type: String, default: '' },
    description: { type: String, default: 'Description not available' },
    tmdbId: { type: String, default: '' },
    releaseDate: { type: String, default: '' },
    trailerUrl: { type: String, default: '' },
    genre: { type: String, default: '' },
    category: { type: String, enum: ['Movie', 'TV Series', 'Documentary'], default: 'Movie' },
    rating: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
