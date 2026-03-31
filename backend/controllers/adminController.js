const db = require("../config/db");

exports.getUsersWithSubscription = async (_req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
         u.id,
         u.name,
         u.email,
         u.is_admin,
         u.is_blocked,
         u.charity_percentage,
         s.id AS subscription_id,
         s.plan AS subscription_plan,
         s.status AS subscription_status,
         s.renewal_date AS subscription_renewal_date
       FROM users u
       LEFT JOIN (
         SELECT s1.*
         FROM subscriptions s1
         INNER JOIN (
           SELECT user_id, MAX(id) AS max_id
           FROM subscriptions
           GROUP BY user_id
         ) latest ON latest.max_id = s1.id
       ) s ON s.user_id = u.id
       ORDER BY u.created_at DESC, u.id DESC`,
    );

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

exports.setUserBlocked = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const { blocked } = req.body;

    if (!Number.isInteger(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    if (typeof blocked !== "boolean") {
      return res.status(400).json({ message: "blocked must be boolean" });
    }

    if (req.user.id === userId) {
      return res.status(400).json({ message: "You cannot block yourself" });
    }

    const [result] = await db.query(
      "UPDATE users SET is_blocked = ? WHERE id = ?",
      [blocked ? 1 : 0, userId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: blocked ? "User blocked" : "User unblocked" });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update user block status",
      error: error.message,
    });
  }
};

exports.setUserSubscriptionStatus = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const { status, plan = "monthly" } = req.body;

    if (!Number.isInteger(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    if (!["active", "inactive"].includes(status)) {
      return res
        .status(400)
        .json({ message: "status must be active or inactive" });
    }

    if (!["monthly", "yearly"].includes(plan)) {
      return res
        .status(400)
        .json({ message: "plan must be monthly or yearly" });
    }

    const renewalDate = new Date();
    renewalDate.setMonth(renewalDate.getMonth() + (plan === "yearly" ? 12 : 1));

    const [existing] = await db.query(
      "SELECT id FROM subscriptions WHERE user_id = ? ORDER BY id DESC LIMIT 1",
      [userId],
    );

    if (existing.length > 0) {
      await db.query(
        "UPDATE subscriptions SET status = ?, plan = ?, renewal_date = ? WHERE id = ?",
        [status, plan, renewalDate, existing[0].id],
      );
    } else {
      await db.query(
        "INSERT INTO subscriptions (user_id, plan, status, renewal_date) VALUES (?, ?, ?, ?)",
        [userId, plan, status, renewalDate],
      );
    }

    return res.json({ message: "Subscription updated" });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update subscription",
      error: error.message,
    });
  }
};
