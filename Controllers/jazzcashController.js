const Jazzcash = require("jazzcash-checkout");
require("dotenv").config(); // Use dotenv to manage environment variables

// Initialize JazzCash credentials
Jazzcash.credentials({
  config: {
    merchantId: process.env.JAZZCASH_MERCHANT_ID,
    password: process.env.JAZZCASH_PASSWORD,
    hashKey: process.env.JAZZCASH_HASH_KEY,
  },
  environment: "sandbox", // available environments: 'live' or 'sandbox'
});

// Export a function to initiate payment
const initiatePayment = async (req, res) => {
  try {
    // Set JazzCash data fields according to your request
    Jazzcash.setData({
      pp_Amount: req.body.amount * 100, // Amount in smallest unit (e.g., PKR)
      pp_BillReference: req.body.orderId, // Unique bill reference
      pp_Description: req.body.description, // Description of the payment
      pp_MobileNumber: req.body.mobileNumber, // Mobile number of the payer
      pp_CNIC: req.body.cnic, // National ID (if required)
    });

    // Returns JazzCash response
    const response = await Jazzcash.createRequest("WALLET"); // or "PAY"
    res.json(response); // Send response back to client
  } catch (error) {
    console.error("Error during payment request:", error);
    res.status(500).send("Error processing payment");
  }
};

module.exports = {
  initiatePayment,
};
