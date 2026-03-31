const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const drawController = require("../controllers/drawController");

router.get("/latest", drawController.getLatestDraw);
router.get("/history", drawController.getDrawHistory);
router.post("/run", auth, admin, drawController.runDraw);

module.exports = router;
