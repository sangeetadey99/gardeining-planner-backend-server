const axios = require("axios");

exports.getCurrentWeather = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    const API_KEY = process.env.WEATHER_API_KEY;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    const response = await axios.get(weatherUrl);
    
    const weatherData = {
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      description: response.data.weather[0].description,
      windSpeed: response.data.wind.speed,
      precipitation: response.data.rain ? response.data.rain["1h"] || 0 : 0,
      conditions: response.data.weather[0].main,
    };

    res.json(weatherData);
  } catch (error) {
    next(error);
  }
};

exports.getWeatherForecast = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    const API_KEY = process.env.WEATHER_API_KEY;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    const response = await axios.get(forecastUrl);
    
    const forecastData = response.data.list.map(item => ({
      date: new Date(item.dt * 1000).toISOString().split('T')[0],
      time: new Date(item.dt * 1000).toISOString().split('T')[1].substring(0, 5),
      temperature: item.main.temp,
      humidity: item.main.humidity,
      description: item.weather[0].description,
      precipitation: item.rain ? item.rain["3h"] || 0 : 0,
      windSpeed: item.wind.speed,
      conditions: item.weather[0].main,
    }));

    res.json(forecastData);
  } catch (error) {
    next(error);
  }
};

exports.getWeatherAlerts = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    const API_KEY = process.env.WEATHER_API_KEY;
    const alertsUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&exclude=minutely,hourly,daily`;

    const response = await axios.get(alertsUrl);
    
    const alerts = response.data.alerts ? response.data.alerts.map(alert => ({
      event: alert.event,
      start: new Date(alert.start * 1000).toISOString(),
      end: new Date(alert.end * 1000).toISOString(),
      description: alert.description,
      severity: alert.sender_name.includes("Warning") ? "high" : "medium",
    })) : [];

    const gardeningAlerts = [];
    
    if (response.data.current.temp < 5) {
      gardeningAlerts.push({
        type: "frost_warning",
        message: "Frost warning! Protect sensitive plants",
        severity: "high",
        action: "Cover plants or bring indoors",
      });
    }
    
    if (response.data.current.wind_speed > 10) {
      gardeningAlerts.push({
        type: "wind_warning",
        message: "High winds expected",
        severity: "medium",
        action: "Secure tall plants and garden structures",
      });
    }

    res.json({
      weather_alerts: alerts,
      gardening_alerts: gardeningAlerts,
    });
  } catch (error) {
    next(error);
  }
};
