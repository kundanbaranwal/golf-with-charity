const router = require("express").Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/me", auth, authController.getMe);

module.exports = router;
