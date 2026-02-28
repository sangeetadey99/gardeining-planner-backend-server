const express = require("express");
const router = express.Router();

const {
  logPestIssue,
  getPestIssues,
  updatePestIssue,
  deletePestIssue,
  getPestAlerts,
} = require("../controllers/pestController");

const protect = require("../middleware/authMiddleware");

router.post("/issues", protect, logPestIssue);
router.get("/issues", protect, getPestIssues);
router.put("/issues/:id", protect, updatePestIssue);
router.delete("/issues/:id", protect, deletePestIssue);
router.get("/alerts", protect, getPestAlerts);

module.exports = router;
