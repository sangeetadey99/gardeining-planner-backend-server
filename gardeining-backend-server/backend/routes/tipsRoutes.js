const express = require("express");
const router = express.Router();

const {
  getTips,
  getTipsByCategory,
  getTipsByPlant,
  getResources,
} = require("../controllers/tipsController");

const protect = require("../middleware/authMiddleware");

router.get("/", protect, getTips);
router.get("/category/:category", protect, getTipsByCategory);
router.get("/plant/:plantType", protect, getTipsByPlant);
router.get("/resources", protect, getResources);

module.exports = router;
