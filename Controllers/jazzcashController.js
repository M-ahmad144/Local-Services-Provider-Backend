const JazzCashCheckout = require("jazzcash-checkout");
require("dotenv").config();

const jazzcash = new JazzCashCheckout({
  merchantId: process.env.JAZZCASH_MERCHANT_ID,
  password: process.env.JAZZCASH_PASSWORD,
  integritySalt: process.env.JAZZCASH_INTEGRITY_SALT,
  returnUrl: process.env.JAZZCASH_RETURN_URL,
});

exports.initiatePayment = async (req, res) => {
  const { amount, orderId, description } = req.body;

  try {
    const transactionData = {
      amount: amount * 100, // PKR in smallest unit
      orderId,
      description,
    };

    const paymentUrl = await jazzcash.createTransaction(transactionData);
    res.json({ paymentUrl });
  } catch (error) {
    console.error("Error initiating payment:", error);
    res.status(500).send("Error processing payment");
  }
};
