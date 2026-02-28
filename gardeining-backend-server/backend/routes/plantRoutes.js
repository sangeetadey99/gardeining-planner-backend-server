const express = require("express");
const router = express.Router();

const {
  addPlant,
  getPlants,
  deletePlant,
   updatePlant,
} = require("../controllers/plantController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, addPlant);

router.get("/", protect, getPlants);

router.delete("/:id", protect, deletePlant);

router.put("/:id", protect, updatePlant);

module.exports = router;