const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Transaction = require("../Models/Transaction");
const Order = require("../Models/Order");

// Create checkout session
exports.createCheckoutSession = async (req, res) => {
  const { amount, order_id, buyer_id } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  try {
    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Custom Payment",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    // Send the session ID back to the frontend
    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: "Failed to create Stripe session" });
  }
};

// Confirm payment status and store transaction data
exports.confirmPaymentStatus = async (req, res) => {
  const { sessionId, order_id, buyer_id, amount } = req.body;

  if (!sessionId || !order_id || !buyer_id || !amount) {
    return res.status(400).json({ error: "Missing required data." });
  }

  try {
    // Retrieve session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res.status(404).json({ error: "Payment session not found." });
    }

    // Retrieve payment status from session
    const paymentStatus =
      session.payment_status === "paid" ? "successful" : "failed";

    // Map paymentStatus to order_status
    const statusMapping = {
      successful: "completed",
      pending: "pending confirmation",
      failed: "in dispute",
    };

    const orderStatus = statusMapping[paymentStatus] || "in dispute";

    // Save the transaction in the database
    const transaction = new Transaction({
      order_id,
      buyer_id,
      amount,
      payment_method: "Credit Card",
      payment_status: paymentStatus,
    });

    await transaction.save();

    // Update the order status
    const updatedOrder = await Order.findByIdAndUpdate(
      order_id,
      { order_status: orderStatus },
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ error: "Order not found or update failed." });
    }

    return res.json({
      success: true,
      message: "Transaction stored and order updated successfully.",
      transaction,
      updatedOrder,
    });
  } catch (error) {
    console.error("Error confirming payment status:", error);
    return res.status(500).json({ error: "Failed to confirm payment status." });
  }
};

// Verify payment session (This endpoint is useful for checking session status but not required if not verifying payment)
exports.verifyPaymentSession = async (req, res) => {
  const { sessionId } = req.params;

  try {
    // Retrieve session details from Stripe using the sessionId
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      res.json({ paymentStatus: "success" });
    } else {
      res.json({ paymentStatus: "failed" });
    }
  } catch (error) {
    console.error("Error verifying session:", error);
    res.status(500).json({ error: "Failed to verify payment session" });
  }
};
