const db = require("../config/db");

exports.uploadProof = async (req, res) => {
  try {
    const { draw_id, proof_url, match_type = null } = req.body;

    if (!draw_id || !proof_url) {
      return res
        .status(400)
        .json({ message: "draw_id and proof_url are required" });
    }

    const sql = `
      INSERT INTO winners(user_id,draw_id,match_type,proof_url,status)
      VALUES(?,?,?,?, 'pending')
    `;

    const [result] = await db.query(sql, [
      req.user.id,
      draw_id,
      match_type,
      proof_url,
    ]);

    return res
      .status(201)
      .json({ message: "Proof submitted", winnerId: result.insertId });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to submit proof", error: error.message });
  }
};

exports.getMyWinners = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT w.id, w.draw_id, w.match_type, w.proof_url, w.status, w.prize_amount,
              d.draw_date, d.num1, d.num2, d.num3, d.num4, d.num5
       FROM winners w
       LEFT JOIN draws d ON d.id = w.draw_id
       WHERE w.user_id = ?
       ORDER BY w.id DESC`,
      [req.user.id],
    );

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch winner records",
      error: error.message,
    });
  }
};

exports.getPendingWinners = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT w.id, w.user_id, u.name AS user_name, u.email, w.draw_id, w.proof_url,
              w.match_type, w.status, w.prize_amount
       FROM winners w
       LEFT JOIN users u ON u.id = w.user_id
       WHERE w.status = 'pending'
       ORDER BY w.id DESC`,
    );

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch pending winners",
      error: error.message,
    });
  }
};

exports.updateWinnerStatus = async (req, res) => {
  try {
    const winnerId = Number(req.params.id);
    const { status, prize_amount = null } = req.body;

    if (!Number.isInteger(winnerId)) {
      return res.status(400).json({ message: "Invalid winner id" });
    }

    if (!["pending", "paid"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const [result] = await db.query(
      "UPDATE winners SET status = ?, prize_amount = ? WHERE id = ?",
      [status, prize_amount, winnerId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Winner record not found" });
    }

    return res.json({ message: "Winner status updated" });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update winner status",
      error: error.message,
    });
  }
};
