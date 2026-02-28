const express = require("express");
const router = express.Router();

const {
  createGardenLayout,
  getGardenLayouts,
  updateGardenLayout,
  deleteGardenLayout,
  getGardenLayoutById,
} = require("../controllers/gardenController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, createGardenLayout);
router.get("/", protect, getGardenLayouts);
router.get("/:id", protect, getGardenLayoutById);
router.put("/:id", protect, updateGardenLayout);
router.delete("/:id", protect, deleteGardenLayout);

module.exports = router;
