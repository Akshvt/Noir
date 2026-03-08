const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tmdbId: { type: Number, required: true },
    title: { type: String, required: true },
    posterPath: { type: String, default: '' },
    mediaType: { type: String, enum: ['movie', 'tv'], default: 'movie' },
    rating: { type: Number, default: 0 },
    releaseDate: { type: String, default: '' },
}, { timestamps: true });

favoriteSchema.index({ userId: 1, tmdbId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
