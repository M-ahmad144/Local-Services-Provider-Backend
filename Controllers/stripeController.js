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

// Endpoint to verify the session
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

// Confirm payment status and store transaction data (with payment verification)
exports.confirmPaymentStatus = async (req, res) => {
  const { sessionId, order_id, buyer_id, amount } = req.body;

  if (!sessionId || !order_id || !buyer_id || !amount) {
    return res.status(400).json({ error: "Missing required data." });
  }

  try {
    // Verify the payment status using the sessionId from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      // Store the transaction data as successful if payment is verified
      const transaction = new Transaction({
        order_id,
        buyer_id,
        amount,
        payment_method: "Credit Card",
        payment_status: "successful",
      });

      // Save the transaction in the database
      await transaction.save();

      // Optionally, update the order status to "completed"
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
    } else {
      res.status(400).json({ error: "Payment verification failed." });
    }
  } catch (error) {
    console.error("Error confirming payment status:", error);
    return res.status(500).json({ error: "Payment confirmation failed." });
  }
};
