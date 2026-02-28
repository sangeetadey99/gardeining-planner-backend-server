const express = require("express");
const router = express.Router();

const {
  addTask,
  getTasks,
  updateTask,
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, addTask);

router.get("/", protect, getTasks);

router.patch("/:id", protect, updateTask);

module.exports = router;