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


module.exports = {
    CreateOrder,
    
};