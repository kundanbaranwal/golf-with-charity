const db = require("../config/db");
const {
  isRazorpayConfigured,
  getRazorpayClient,
  verifyRazorpaySignature,
} = require("../config/razorpay");

exports.createSubscription = async (req, res) => {
  try {
    const { planType = "monthly", paymentGateway = "razorpay" } = req.body;
    const normalizedPlan = String(planType).toLowerCase();

    if (!["monthly", "yearly"].includes(normalizedPlan)) {
      return res
        .status(400)
        .json({ message: "planType must be monthly or yearly" });
    }

    const now = new Date();
    const renewalDate = new Date(now);
    renewalDate.setMonth(
      renewalDate.getMonth() + (normalizedPlan === "yearly" ? 12 : 1),
    );

    let providerOrderId = `mock_${Date.now()}`;

    if (paymentGateway === "razorpay" && isRazorpayConfigured()) {
      const razorpay = getRazorpayClient();

      const order = await razorpay.orders.create({
        amount: normalizedPlan === "yearly" ? 8999 : 999,
        currency: process.env.CURRENCY || "INR",
        receipt: `sub_${req.user.id}_${Date.now()}`,
      });

      providerOrderId = order.id;
    }

    const [result] = await db.query(
      "INSERT INTO subscriptions(user_id, plan, status, renewal_date) VALUES (?, ?, 'inactive', ?)",
      [req.user.id, normalizedPlan, renewalDate],
    );

    return res.status(201).json({
      message: "Subscription intent created",
      subscriptionId: result.insertId,
      amount: normalizedPlan === "yearly" ? 8999 : 999,
      currency: process.env.CURRENCY || "INR",
      orderId: providerOrderId,
      paymentGateway,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create subscription",
      error: error.message,
    });
  }
};

exports.verifySubscriptionPayment = async (req, res) => {
  try {
    const {
      subscriptionId,
      paymentId,
      razorpayOrderId,
      razorpaySignature,
      status = "active",
    } = req.body;

    if (!subscriptionId || !paymentId) {
      return res
        .status(400)
        .json({ message: "subscriptionId and paymentId are required" });
    }

    if (razorpayOrderId && razorpaySignature && isRazorpayConfigured()) {
      if (
        !verifyRazorpaySignature(razorpayOrderId, paymentId, razorpaySignature)
      ) {
        return res.status(400).json({ message: "Invalid Razorpay signature" });
      }
    }

    if (!["active", "inactive"].includes(status)) {
      return res
        .status(400)
        .json({ message: "status must be active or inactive" });
    }

    const [result] = await db.query(
      `UPDATE subscriptions
       SET status = ?
       WHERE id = ? AND user_id = ?`,
      [status, subscriptionId, req.user.id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    return res.json({ message: "Subscription verified" });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to verify subscription",
      error: error.message,
    });
  }
};

exports.getMySubscription = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, user_id, plan, status, renewal_date, created_at
       FROM subscriptions
       WHERE user_id = ?
       ORDER BY id DESC
       LIMIT 1`,
      [req.user.id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No subscription found" });
    }

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch subscription",
      error: error.message,
    });
  }
};
