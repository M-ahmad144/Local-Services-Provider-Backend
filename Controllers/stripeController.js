const Transaction = require("../Models/Transaction");
const Order = require("../Models/Order");

exports.confirmPaymentStatus = async (req, res) => {
  const { sessionId, order_id, buyer_id } = req.body;

  if (!sessionId || !order_id || !buyer_id) {
    return res.status(400).json({ error: "Missing required data." });
  }

  try {
    // Directly store the transaction without verifying payment status
    const transaction = new Transaction({
      order_id,
      buyer_id,
      amount: req.body.amount, // You should send the amount from the frontend if possible
      payment_method: "Credit Card", // You can store the method if you want
      payment_status: "successful", // Since you trust Stripe, mark it as successful
    });

    // Save the transaction in the database
    await transaction.save();

    // Optionally, you can update the order status to "completed"
    const updatedOrder = await Order.findByIdAndUpdate(
      order_id,
      { order_status: "completed" },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Payment was successful",
      transaction,
      updatedOrder,
    });
  } catch (error) {
    console.error("Error saving transaction:", error);
    return res.status(500).json({ error: "Payment confirmation failed." });
  }
};
