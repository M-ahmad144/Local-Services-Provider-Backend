const Order = require("../Models/Order");
const Transaction = require("../Models/Transaction");


const GetAllOrders = async(req,res,next) =>{

    const user_id = req.query.user_id;

    try {
        const orders = await Order.find({service_provider_id: user_id})
        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json({ error: "Error fetching order" });
        
    }
}

const SuccessfulTransactions = async (req, res) => {
    try {
      const  serviceProviderId  = req.query.user_id;

      const orders = await Order.find({ service_provider_id: serviceProviderId });
      
      const orderIds = orders.map(order => order._id);
  
      const transactions = await Transaction.find({
        order_id: { $in: orderIds },
        payment_status: "successful",
      });
  
      res.status(200).json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching transactions.",
        error: error.message,
      });
    }
  };

module.exports = {GetAllOrders , SuccessfulTransactions}