const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const winnerController = require("../controllers/winnerController");

router.post("/proof", auth, winnerController.uploadProof);
router.get("/me", auth, winnerController.getMyWinners);
router.get("/pending", auth, admin, winnerController.getPendingWinners);
router.patch("/:id/status", auth, admin, winnerController.updateWinnerStatus);

module.exports = router;
