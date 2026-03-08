const WatchHistory = require('../models/WatchHistory');

exports.addToHistory = async (req, res) => {
    try {
        const { tmdbId, title, posterPath, mediaType } = req.body;

        // Upsert: update watchedAt if entry already exists
        const history = await WatchHistory.findOneAndUpdate(
            { userId: req.user._id, tmdbId },
            { userId: req.user._id, tmdbId, title, posterPath, mediaType, watchedAt: new Date() },
            { upsert: true, new: true }
        );
        res.status(201).json({ history });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const { limit = 20 } = req.query;
        const history = await WatchHistory.find({ userId: req.user._id })
            .sort({ watchedAt: -1 })
            .limit(Number(limit));
        res.json({ history });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
