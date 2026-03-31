const db = require("../config/db");

exports.getCharities = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM charities ORDER BY id DESC");
    return res.json(rows);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch charities", error: error.message });
  }
};

exports.getCharityById = async (req, res) => {
  try {
    const charityId = Number(req.params.id);
    if (!Number.isInteger(charityId)) {
      return res.status(400).json({ message: "Invalid charity id" });
    }

    const [rows] = await db.query("SELECT * FROM charities WHERE id = ?", [
      charityId,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Charity not found" });
    }

    return res.json(rows[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch charity", error: error.message });
  }
};

exports.addCharity = async (req, res) => {
  try {
    const { name, description = null, image_url = null } = req.body;

    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    const [result] = await db.query(
      "INSERT INTO charities(name,description,image_url) VALUES(?,?,?)",
      [name, description, image_url],
    );

    return res
      .status(201)
      .json({ message: "Charity added", charityId: result.insertId });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to add charity", error: error.message });
  }
};

exports.updateCharity = async (req, res) => {
  try {
    const charityId = Number(req.params.id);
    const { name, description, image_url } = req.body;

    if (!Number.isInteger(charityId)) {
      return res.status(400).json({ message: "Invalid charity id" });
    }

    const [result] = await db.query(
      "UPDATE charities SET name = ?, description = ?, image_url = ? WHERE id = ?",
      [name, description, image_url, charityId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Charity not found" });
    }

    return res.json({ message: "Charity updated" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update charity", error: error.message });
  }
};

exports.deleteCharity = async (req, res) => {
  try {
    const charityId = Number(req.params.id);
    if (!Number.isInteger(charityId)) {
      return res.status(400).json({ message: "Invalid charity id" });
    }

    const [result] = await db.query("DELETE FROM charities WHERE id = ?", [
      charityId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Charity not found" });
    }

    return res.json({ message: "Charity deleted" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete charity", error: error.message });
  }
};
