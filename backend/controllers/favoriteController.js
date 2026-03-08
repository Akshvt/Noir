const Favorite = require('../models/Favorite');

exports.addFavorite = async (req, res) => {
    try {
        const { tmdbId, title, posterPath, mediaType, rating, releaseDate } = req.body;
        const existing = await Favorite.findOne({ userId: req.user._id, tmdbId });
        if (existing) return res.status(400).json({ message: 'Already in favorites' });

        const favorite = await Favorite.create({
            userId: req.user._id, tmdbId, title, posterPath, mediaType, rating, releaseDate,
        });
        res.status(201).json({ favorite });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeFavorite = async (req, res) => {
    try {
        const favorite = await Favorite.findOneAndDelete({
            userId: req.user._id, tmdbId: req.params.tmdbId,
        });
        if (!favorite) return res.status(404).json({ message: 'Favorite not found' });
        res.json({ message: 'Removed from favorites' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json({ favorites });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.checkFavorite = async (req, res) => {
    try {
        const favorite = await Favorite.findOne({ userId: req.user._id, tmdbId: req.params.tmdbId });
        res.json({ isFavorite: !!favorite });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
