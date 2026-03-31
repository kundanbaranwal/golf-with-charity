const db = require("../config/db");

exports.addScore = async (req, res) => {
  try {
    const { score, date } = req.body;
    const userId = req.user.id;

    if (!score || !date) {
      return res.status(400).json({ message: "score and date are required" });
    }

    const numericScore = Number(score);
    if (
      !Number.isInteger(numericScore) ||
      numericScore < 1 ||
      numericScore > 45
    ) {
      return res
        .status(400)
        .json({ message: "score must be an integer between 1 and 45" });
    }

    const [scores] = await db.query(
      "SELECT id FROM scores WHERE user_id = ? ORDER BY date ASC, id ASC",
      [userId],
    );

    if (scores.length >= 5) {
      await db.query("DELETE FROM scores WHERE id = ?", [scores[0].id]);
    }

    await db.query("INSERT INTO scores(user_id,score,date) VALUES(?,?,?)", [
      userId,
      numericScore,
      date,
    ]);

    return res.status(201).json({ message: "Score added" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to add score", error: error.message });
  }
};

exports.getMyScores = async (req, res) => {
  try {
    const [scores] = await db.query(
      "SELECT id, score, date FROM scores WHERE user_id = ? ORDER BY date DESC, id DESC",
      [req.user.id],
    );

    return res.json(scores);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch scores", error: error.message });
  }
};

exports.deleteScore = async (req, res) => {
  try {
    const scoreId = Number(req.params.id);
    if (!Number.isInteger(scoreId)) {
      return res.status(400).json({ message: "Invalid score id" });
    }

    const [result] = await db.query(
      "DELETE FROM scores WHERE id = ? AND user_id = ?",
      [scoreId, req.user.id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Score not found" });
    }

    return res.json({ message: "Score deleted" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete score", error: error.message });
  }
};
