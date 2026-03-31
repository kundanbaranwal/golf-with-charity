const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const adminController = require("../controllers/adminController");

router.get("/users", auth, admin, adminController.getUsersWithSubscription);
router.patch("/users/:id/block", auth, admin, adminController.setUserBlocked);
router.patch(
  "/users/:id/subscription",
  auth,
  admin,
  adminController.setUserSubscriptionStatus,
);

module.exports = router;
