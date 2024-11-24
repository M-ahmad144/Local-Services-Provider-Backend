const mongoose = require('mongoose');
const Review = require('../Models/Review');
const Order = require('../Models/Order');
const User = require('../Models/User');

// GET /reviewdata
const reviewdata = async (req, res) => {
    try {
        const { buyer_id, order_id } = req.body;

        const order=await Order.findById(order_id);
        const service_provider_id=order.service_provider_id;

        const service_provider=await User.findById(service_provider_id);
        const service_provider_name=service_provider.name;
        const description=service_provider.description;
        
        const serviceid=order.service_id;
        const all_reviews = await Review.find({ service_id: serviceid });

        if (!all_reviews) {
            return res.status(404).json({ error: 'No reviews found.' });
        }

        res.status(200).json({ reviews: all_reviews, service_provider_name ,description});


    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const addreview = async (req, res) =>{
    try {
        const { buyer_id, order_id,  rating, comment } = req.body;
        console.log(buyer_id, order_id, rating, comment);

        const order = await Order.findById(order_id);
        const service_id = order.service_id;

        const newReview = new Review({
            order_id,
            buyer_id,
            service_id,
            rating,
            review_text: comment,

        });

        await newReview.save();
        res.status(201).json({ message: 'Review added successfully' });




    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = { reviewdata ,addreview};
