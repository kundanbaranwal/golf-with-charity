const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const charityController = require("../controllers/charityController");

router.get("/", charityController.getCharities);
router.get("/:id", charityController.getCharityById);
router.post("/", auth, admin, charityController.addCharity);
router.put("/:id", auth, admin, charityController.updateCharity);
router.delete("/:id", auth, admin, charityController.deleteCharity);

module.exports = router;
