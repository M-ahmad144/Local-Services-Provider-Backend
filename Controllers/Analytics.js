const Order = require("../Models/Order");


const GetAllOrders = async(req,res,next) =>{

    const user_id = req.query.user_id;

    try {
        const orders = await Order.find({service_provider_id: user_id})
        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json({ error: "Error fetching order" });
        
    }
}


module.exports = {GetAllOrders}