const mongoose = require("mongoose");
const Order = require("../Models/Order");
const Transaction = require("../Models/Transaction");


const GetAllOrders = async (req, res, next) => {
  const user_id = req.query.user_id;

  try {
    const orders = await Order.find({ service_provider_id: user_id });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Error fetching order" });
  }
};

const SuccessfulTransactions = async (req, res) => {
  try {
    const serviceProviderId = req.query.user_id;

    const orders = await Order.find({ service_provider_id: serviceProviderId });

    const orderIds = orders.map((order) => order._id);

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

const GetOrdersCountByService = async (req, res) => {
  try {
    const { user_id } = req.query; 

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const orders = await Order.aggregate([
      {
        $match: {
          $or: [
            { service_provider_id: new mongoose.Types.ObjectId(user_id) },
            { buyer_id: new mongoose.Types.ObjectId(user_id) }
          ]
        }
      },
      {
        $lookup: {
          from: "services",
          localField: "service_id",
          foreignField: "_id",
          as: "service_details"
        }
      },
      {
        $unwind: "$service_details"
      },
      {
        $group: {
          _id: "$service_details.title",
          count: { $sum: 1 } 
        }
      },
      {
        $project: {
          service_title: "$_id",
          order_count: "$count",  
          _id: 0  
        }
      }
    ]);

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = { GetAllOrders, SuccessfulTransactions , GetOrdersCountByService };
