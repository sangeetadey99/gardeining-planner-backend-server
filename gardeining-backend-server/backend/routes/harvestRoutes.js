const express = require("express");
const router = express.Router();

const {
  createHarvestPlan,
  getHarvestPlans,
  updateHarvestPlan,
  deleteHarvestPlan,
  logHarvest,
  getHarvestHistory,
  predictHarvest,
} = require("../controllers/harvestController");

const protect = require("../middleware/authMiddleware");

router.post("/plans", protect, createHarvestPlan);
router.get("/plans", protect, getHarvestPlans);
router.put("/plans/:id", protect, updateHarvestPlan);
router.delete("/plans/:id", protect, deleteHarvestPlan);
router.post("/log", protect, logHarvest);
router.get("/history", protect, getHarvestHistory);
router.get("/predict/:plantId", protect, predictHarvest);

module.exports = router;
