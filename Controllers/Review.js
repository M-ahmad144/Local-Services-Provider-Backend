const mongoose = require('mongoose');
const Review = require('../Models/Review');

// GET /reviewdata
const reviewdata = async (req, res) => {
    try {
        const { buyer_id, order_id } = req.query;

        // Validate inputs
        if (!buyer_id || !order_id) {
            return res.status(400).json({ error: 'buyer_id and order_id are required.' });
        }

        // Fetch reviews based on buyer_id and order_id
        const reviews = await Review.find({ buyer_id, order_id })
            .populate('order_id', 'orderDetails') // Adjust fields based on the Order model
            .populate('buyer_id', 'name email') // Adjust fields based on the User model
            .populate('service_id', 'title description') // Adjust fields based on the Service model
            .exec();

        if (reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found for the given criteria.' });
        }

        // Respond with the reviews
        res.status(200).json({ message: 'Reviews fetched successfully.', reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = { reviewdata };
