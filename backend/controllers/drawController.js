const db = require("../config/db");
const { generateDraw } = require("../services/drawService");

exports.runDraw = async (req, res) => {
  try {
    const numbers = generateDraw();

    const sql = `
      INSERT INTO draws(draw_date,num1,num2,num3,num4,num5,status)
      VALUES(CURDATE(),?,?,?,?,?,'pending')
    `;

    const [result] = await db.query(sql, numbers);

    return res.status(201).json({
      message: "Draw generated",
      drawId: result.insertId,
      numbers,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to run draw", error: error.message });
  }
};

exports.getLatestDraw = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, draw_date, num1, num2, num3, num4, num5, status
       FROM draws
       ORDER BY draw_date DESC, id DESC
       LIMIT 1`,
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No draw found" });
    }

    return res.json(rows[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch draw", error: error.message });
  }
};

exports.getDrawHistory = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, draw_date, num1, num2, num3, num4, num5, status
       FROM draws
       ORDER BY draw_date DESC, id DESC
       LIMIT 50`,
    );

    return res.json(rows);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch draw history", error: error.message });
  }
};
