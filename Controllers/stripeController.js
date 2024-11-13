const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Transaction = require("../Models/Transaction");
const Order = require("../Models/Order");

exports.createCheckoutSession = async (req, res) => {
  const { amount, order_id, buyer_id } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  try {
    // Create a Stripe Checkout session
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

exports.confirmPaymentStatus = async (req, res) => {
  const { sessionId, order_id, buyer_id } = req.body;

  if (!sessionId || !order_id || !buyer_id) {
    return res.status(400).json({ error: "Missing required data." });
  }

  try {
    // Retrieve session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Confirm payment
    if (session.payment_status === "paid") {
      // Update order status to "completed"
      const updatedOrder = await Order.findByIdAndUpdate(
        order_id,
        { order_status: "completed" },
        { new: true }
      );

      // Store transaction details
      const transaction = new Transaction({
        order_id,
        buyer_id,
        amount: session.amount_total,
        payment_method: session.payment_method_types[0],
        payment_status: "successful",
      });
      await transaction.save();

      return res.json({
        success: true,
        message: "Payment was successful",
        transaction,
        updatedOrder,
      });
    } else {
      return res.status(400).json({ error: "Payment was unsuccessful." });
    }
  } catch (error) {
    console.error("Error confirming payment:", error);
    return res.status(500).json({ error: "Payment confirmation failed." });
  }
};
