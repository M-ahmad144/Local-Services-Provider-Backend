const Orders = require('../Models/Order')


const CreateOrder = async (req,res,next) =>{

    try {
        const data  = req.body

        const order = await Orders.create({
            service_id : data.service_id,
            buyer_id: data.buyer_id,
            service_provider_id: data.service_provider_id,
            order_status: "pending",
            price: data.price,
            description : data.description,
            appointment_date: data.date,
            appointment_time: data.time,
        })

        res.status(201).json(order);
    } 
    catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Error creating order" })
    }

}


const GetPendingOrders = async (req, res, next) => {
    const { user_type } = req.body;
    console.log(user_type)
    try {
        let orders;

        if (user_type === 'buyer') {
            orders = await Orders.find({ buyer_id: req.body.user_id, order_status: 'pending' });
        } else if (user_type === 'service_provider') {
            orders = await Orders.find({ service_provider_id: req.body.user_id, order_status: 'pending' });
        } else {
            return res.status(400).json({ error: 'Invalid user_type provided' });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching pending orders:', error);
        res.status(500).json({ error: 'Error fetching pending orders' });
    }
};



module.exports = {
    CreateOrder,
    GetPendingOrders
};