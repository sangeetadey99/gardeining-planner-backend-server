const express = require("express");
const router = express.Router();

const {
  addJournal,
  getJournal,
} = require("../controllers/journalController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, addJournal);

router.get("/", protect, getJournal);

module.exports = router;