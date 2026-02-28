const express = require("express");
const router = express.Router();

const {
  getCurrentWeather,
  getWeatherForecast,
  getWeatherAlerts,
} = require("../controllers/weatherController");

const protect = require("../middleware/authMiddleware");

router.get("/current", protect, getCurrentWeather);
router.get("/forecast", protect, getWeatherForecast);
router.get("/alerts", protect, getWeatherAlerts);

module.exports = router;
