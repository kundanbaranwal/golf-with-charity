const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const subscriptionController = require("../controllers/subscriptionController");

router.post("/create", auth, subscriptionController.createSubscription);
router.post("/verify", auth, subscriptionController.verifySubscriptionPayment);
router.get("/me", auth, subscriptionController.getMySubscription);

module.exports = router;
