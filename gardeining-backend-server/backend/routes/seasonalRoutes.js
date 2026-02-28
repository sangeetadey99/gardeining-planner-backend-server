const express = require("express");
const router = express.Router();

const {
  createSeasonalTask,
  getSeasonalTasks,
  updateSeasonalTask,
  deleteSeasonalTask,
  getSeasonalRecommendations,
} = require("../controllers/seasonalController");

const protect = require("../middleware/authMiddleware");

router.post("/tasks", protect, createSeasonalTask);
router.get("/tasks", protect, getSeasonalTasks);
router.put("/tasks/:id", protect, updateSeasonalTask);
router.delete("/tasks/:id", protect, deleteSeasonalTask);
router.get("/recommendations", protect, getSeasonalRecommendations);

module.exports = router;
