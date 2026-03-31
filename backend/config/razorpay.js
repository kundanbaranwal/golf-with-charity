const crypto = require("crypto");
const Razorpay = require("razorpay");

const keyId = process.env.RAZORPAY_KEY_ID || "";
const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

const isRazorpayConfigured = () => Boolean(keyId && keySecret);

const getRazorpayClient = () => {
  if (!isRazorpayConfigured()) {
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  if (!isRazorpayConfigured()) {
    return false;
  }

  const generated = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return generated === signature;
};

module.exports = {
  isRazorpayConfigured,
  getRazorpayClient,
  verifyRazorpaySignature,
};
