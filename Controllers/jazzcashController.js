const crypto = require("crypto");
const axios = require("axios");

const initiatePayment = async (req, res) => {
  const {
    pp_Amount,
    pp_BillReference,
    pp_Description,
    pp_Language,
    pp_CNIC,
    pp_MobileNumber, // Ensure this is included in the request body
  } = req.body;

  // Load environment variables
  const pp_MerchantID = process.env.JAZZCASH_MERCHANT_ID;
  const pp_Password = process.env.JAZZCASH_PASSWORD;
  const IntegeritySalt = process.env.JAZZCASH_HASH_KEY;

  // Validate required fields
  if (
    !pp_Amount ||
    !pp_BillReference ||
    !pp_Description ||
    !pp_Language ||
    !pp_CNIC ||
    !pp_MobileNumber
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const dateandtime = new Date().toISOString().slice(0, 19).replace("T", "");
  const dexpiredate = new Date(Date.now() + 86400000)
    .toISOString()
    .slice(0, 19)
    .replace("T", ""); // 1 day later
  const pp_TxnRefNo = `T${dateandtime}`; // Ensure this is unique and correctly formatted
  const pp_TxnType = "MWALLET";
  const pp_ver = "1.1";
  const pp_TxnCurrency = "PKR";

  // Create the string to hash (superdata)
  const superdata = [
    IntegeritySalt,
    pp_Amount,
    pp_BillReference,
    pp_Description,
    pp_Language,
    pp_MerchantID,
    pp_Password,
    process.env.JAZZCASH_RETURN_URL, // Use your return URL from env
    pp_TxnCurrency,
    dateandtime,
    dexpiredate,
    pp_TxnRefNo, // Include this in superdata
    pp_TxnType,
    pp_ver,
    pp_CNIC,
    pp_MobileNumber, // Include mobile number in superdata
  ].join("&");

  // Generate secure hash
  const hash = crypto
    .createHmac("sha256", IntegeritySalt)
    .update(superdata)
    .digest("hex");

  // Prepare payment data to send to JazzCash API
  const paymentData = {
    pp_Version: pp_ver,
    pp_TxnType: pp_TxnType,
    pp_Language: pp_Language,
    pp_MerchantID: pp_MerchantID,
    pp_Password: pp_Password,
    pp_TxnRefNo: pp_TxnRefNo, // Send this value
    pp_Amount: pp_Amount,
    pp_TxnCurrency: pp_TxnCurrency,
    pp_TxnDateTime: dateandtime,
    pp_BillReference: pp_BillReference,
    pp_Description: pp_Description,
    pp_TxnExpiryDateTime: dexpiredate,
    pp_ReturnURL: process.env.JAZZCASH_RETURN_URL, // Use your return URL from env
    pp_CNIC: pp_CNIC,
    pp_MobileNumber: pp_MobileNumber, // Add the mobile number to paymentData
    pp_SecureHash: hash, // Add the secure hash
  };

  try {
    // Send paymentData to the JazzCash API
    const response = await axios.post(
      "https://sandbox.jazzcash.com.pk/ApplicationAPI/API/Payment/DoTransaction",
      paymentData
    );

    // Handle response from JazzCash
    res.json({ message: "Payment initiated", paymentResponse: response.data });
  } catch (error) {
    console.error("Payment error:", error);

    // If error response is available from JazzCash API
    if (error.response) {
      return res.status(500).json({
        message: "Payment initiation failed",
        error: error.response.data, // Return detailed error from JazzCash API
      });
    }
    res
      .status(500)
      .json({ message: "Payment initiation failed", error: error.message });
  }
};

module.exports = { initiatePayment };
