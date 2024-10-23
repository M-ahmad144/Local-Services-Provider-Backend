const Jazzcash = require("jazzcash-checkout");

// JazzCash Configuration Constants
const JAZZCASH_MERCHANT_ID = "MC132184";
const JAZZCASH_PASSWORD = "zz999zfs70";
const JAZZCASH_HASH_KEY = "1t23t4c60x";
const JAZZCASH_RETURN_URL = "https://myneighbourly.vercel.app";

const checkout = async (req, res) => {
  try {
    const productId = req.params.productId;
    const productPrice = 1;

    // JazzCash credentials configuration
    Jazzcash.credentials({
      config: {
        merchantId: JAZZCASH_MERCHANT_ID,
        password: JAZZCASH_PASSWORD,
        hashKey: JAZZCASH_HASH_KEY,
      },
      environment: "live",
    });

    const pp_TxnDateTime = getDateTime();
    const pp_TxnExpiryDateTime = getDateTime(1);
    const pp_TxnRefNo = "T" + pp_TxnDateTime;

    // JazzCash payment transaction data
    Jazzcash.setData({
      pp_Version: "1.1",
      pp_TxnType: "MWALLET",
      pp_Language: "EN",
      pp_MerchantID: JAZZCASH_MERCHANT_ID,
      pp_Password: JAZZCASH_PASSWORD,
      pp_BankID: "TBANK",
      pp_ProductID: "RETL",
      pp_TxnRefNo: pp_TxnRefNo,
      pp_Amount: productPrice,
      pp_TxnCurrency: "PKR",
      pp_TxnDateTime: pp_TxnDateTime,
      pp_BillReference: "billRef",
      pp_Description: `Payment for Product ID ${productId}`,
      pp_TxnExpiryDateTime: pp_TxnExpiryDateTime,
      pp_ReturnURL: JAZZCASH_RETURN_URL,
      ppmpf_1: "1",
      ppmpf_2: "2",
      ppmpf_3: "3",
      ppmpf_4: "4",
      ppmpf_5: "5",
    });

    // Create the payment request using JazzCash API
    const paymentRequest = await Jazzcash.createRequest("PAY");

    // Send the payment request immediately
    res.json(paymentRequest);
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Utility function to get the current date and time in JazzCash required format
function getDateTime(daysToAdd = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  return date
    .toISOString()
    .slice(0, 19)
    .replace("T", "")
    .replace(/-/g, "")
    .replace(/:/g, "")
    .replace(/ /g, "");
}

module.exports = {
  checkout,
};
