const router = require("express").Router();
const scoreController = require("../controllers/scoreController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, scoreController.getMyScores);
router.post("/", auth, scoreController.addScore);
router.delete("/:id", auth, scoreController.deleteScore);

module.exports = router;
