const jwt = require("jsonwebtoken");
const db = require("../config/db");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

    const [rows] = await db.query(
      "SELECT id, is_admin, is_blocked FROM users WHERE id = ?",
      [decoded.id],
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    if (Boolean(rows[0].is_blocked)) {
      return res
        .status(403)
        .json({ message: "Your account is blocked. Please contact admin." });
    }

    req.user = {
      id: rows[0].id,
      isAdmin: Boolean(rows[0].is_admin),
    };

    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};
