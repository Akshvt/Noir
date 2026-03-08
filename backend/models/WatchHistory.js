const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tmdbId: { type: Number, required: true },
    title: { type: String, required: true },
    posterPath: { type: String, default: '' },
    mediaType: { type: String, enum: ['movie', 'tv'], default: 'movie' },
    watchedAt: { type: Date, default: Date.now },
}, { timestamps: true });

watchHistorySchema.index({ userId: 1, watchedAt: -1 });

module.exports = mongoose.model('WatchHistory', watchHistorySchema);
