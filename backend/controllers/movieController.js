const Movie = require('../models/Movie');

exports.createMovie = async (req, res) => {
    try {
        const movie = await Movie.create(req.body);
        res.status(201).json({ movie });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMovies = async (req, res) => {
    try {
        const { page = 1, limit = 20, category, genre, search } = req.query;
        const filter = {};
        if (category) filter.category = category;
        if (genre) filter.genre = { $regex: genre, $options: 'i' };
        if (search) filter.title = { $regex: search, $options: 'i' };

        const movies = await Movie.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));
        const total = await Movie.countDocuments(filter);

        res.json({ movies, total, page: Number(page), pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.json({ movie });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.json({ movie });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.json({ message: 'Movie deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
