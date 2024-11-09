const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post("/", async (req, res) => {
  const { amount } = req.body;

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
            unit_amount: amount, // Amount in cents
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
});

// Confirm payment status after the success redirect
router.post("/confirm-payment", async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: "Session ID is required" });
  }

  try {
    // Retrieve the session from Stripe using the session ID
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Check if the session was successful
    if (session.payment_status === "paid") {
      return res.json({ success: true, message: "Payment was successful" });
    } else {
      return res.status(400).json({ error: "Payment not successful" });
    }
  } catch (error) {
    console.error("Error confirming payment:", error);
    return res.status(500).json({ error: "Failed to confirm payment" });
  }
});

module.exports = router;
