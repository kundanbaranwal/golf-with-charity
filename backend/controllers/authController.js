const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      charity_id = null,
      charity_percentage = 10,
    } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "name, email and password are required" });
    }

    if (String(password).length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const charityPercentage = Number(charity_percentage);
    if (
      !Number.isInteger(charityPercentage) ||
      charityPercentage < 10 ||
      charityPercentage > 30
    ) {
      return res.status(400).json({
        message: "charity_percentage must be an integer between 10 and 30",
      });
    }

    const [existingUsers] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const sql =
      "INSERT INTO users(name,email,password,is_admin,is_blocked,charity_id,charity_percentage) VALUES(?,?,?,?,?,?,?)";

    const [result] = await db.query(sql, [
      name,
      email,
      hash,
      0,
      0,
      charity_id,
      charityPercentage,
    ]);

    return res.status(201).json({
      message: "User created",
      userId: result.insertId,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to sign up", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    if (Boolean(user.is_blocked)) {
      return res.status(403).json({
        message: "Your account is blocked. Please contact admin.",
      });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user.id, isAdmin: Boolean(user.is_admin) },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: Boolean(user.is_admin),
        isBlocked: Boolean(user.is_blocked),
        charity_id: user.charity_id,
        charity_percentage: user.charity_percentage,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to login", error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, email, is_admin, is_blocked, charity_id, charity_percentage FROM users WHERE id = ?",
      [req.user.id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      id: rows[0].id,
      name: rows[0].name,
      email: rows[0].email,
      isAdmin: Boolean(rows[0].is_admin),
      isBlocked: Boolean(rows[0].is_blocked),
      charity_id: rows[0].charity_id,
      charity_percentage: rows[0].charity_percentage,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch profile", error: error.message });
  }
};
