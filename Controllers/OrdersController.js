const Orders = require('../Models/Order')


const CreateOrder = async (req, res, next) => {
    try {
        const data = req.body;

        // Destructure the data with default values for specific fields
        const {
            service_id,
            buyer_id,
            service_provider_id,
            price,
            description,
            date,
            time
        } = data;

        // Create the order with optional fields having default values
        const order = await Orders.create({
            service_id,
            buyer_id,
            service_provider_id,
            order_status: "pending",
            price,
            description,
            appointment_date: date,
            appointment_time: time,
            isUpdated: data.isUpdated ?? false,  // Defaults to false if not provided
            service_provider_price: data.service_provider_price ?? 0, // Defaults to 0 if not provided
            service_provider_date: Date.now(), // Defaults to current date
            service_provider_time: data.service_provider_time ?? "", // Defaults to empty string
            accepted_by: data.accepted_by ?? "" // Defaults to empty string
        });

        res.status(201).json(order);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Error creating order" });
    }
};



const GetPendingOrders = async (req, res, next) => {
    const { user_type, user_id } = req.query; // Extract from query parameters
    console.log(user_type, user_id);
    
    try {
        let orders;

        if (user_type === 'buyer') {
            
            orders = await Orders.find({ buyer_id: user_id, order_status: 'pending' })
                                 .populate('service_provider_id', 'name');
        } else if (user_type === 'service provider') {
            
            orders = await Orders.find({ service_provider_id: user_id, order_status: 'pending' })
                                 .populate('buyer_id', 'name');
        } else {
            return res.status(400).json({ error: 'Invalid user_type provided' });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching pending orders:', error);
        res.status(500).json({ error: 'Error fetching pending orders' });
    }
};

const GetInProgressOrders = async (req, res, next) => {
    const { user_type, user_id } = req.query; // Extract from query parameters
    console.log(user_type, user_id);
    
    try {
        let orders;

        if (user_type === 'buyer') {
            
            orders = await Orders.find({ buyer_id: user_id, order_status: 'in progress' })
                                 .populate('service_provider_id', 'name location');
        } else if (user_type === 'service provider') {
            
            orders = await Orders.find({ service_provider_id: user_id, order_status: 'in progress' })
                                 .populate('buyer_id', 'name location');
        } else {
            return res.status(400).json({ error: 'Invalid user_type provided' });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching pending orders:', error);
        res.status(500).json({ error: 'Error fetching pending orders' });
    }
};

const counterPriceUpdate = async (req, res, next) => {
    const { order_id, service_provider_price } = req.body; 

    try {

        const updatedOrder = await Orders.findByIdAndUpdate(
            order_id,
            { 
                service_provider_price: service_provider_price,
                isUpdated:true
            },
            { new: true } 
        );

        if (!updatedOrder) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error('Error updating service provider price:', error);
        res.status(500).json({ error: 'Error updating service provider price' });
    }
};


const counterTimeUpdate = async (req, res, next) => {
    const { order_id, service_provider_date , service_provider_time } = req.body; 

    try {

        const updatedOrder = await Orders.findByIdAndUpdate(
            order_id,
            { 
                service_provider_date: service_provider_date,
                service_provider_time : service_provider_time,
                isUpdated:true
            },
            { new: true } 
        );

        if (!updatedOrder) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error('Error updating service provider price:', error);
        res.status(500).json({ error: 'Error updating service provider price' });
    }
};



const orderAcceptUpdate = async (req, res, next) => {
    const { order_id , user_type } = req.body; 

    try {

        const updatedOrder = await Orders.findByIdAndUpdate(
            order_id,
            {
                accepted_by : user_type, 
                order_status: "in progress"
            },
            { new: true } 
        );

        if (!updatedOrder) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error('Error updating service provider price:', error);
        res.status(500).json({ error: 'Error updating service provider price' });
    }
};


const orderRejectUpdate = async (req, res, next) => {
    const { order_id , user_type } = req.body; 

    try {

        const updatedOrder = await Orders.findByIdAndUpdate(
            order_id,
            {
                rejected_by : user_type, 
                order_status: "cancelled"
            },
            { new: true } 
        );

        if (!updatedOrder) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error('Error updating service provider price:', error);
        res.status(500).json({ error: 'Error updating service provider price' });
    }
};




module.exports = {
    CreateOrder,
    GetPendingOrders,
    counterPriceUpdate,
    counterTimeUpdate,
    orderAcceptUpdate,
    GetInProgressOrders,
    orderRejectUpdate
};