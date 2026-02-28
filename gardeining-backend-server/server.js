const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./backend/routes/authRoutes");
const plantRoutes = require("./backend/routes/plantRoutes");
const taskRoutes = require("./backend/routes/taskRoutes");
const journalRoutes = require("./backend/routes/journalRoutes");
const gardenRoutes = require("./backend/routes/gardenRoutes");
const pestRoutes = require("./backend/routes/pestRoutes");
const seasonalRoutes = require("./backend/routes/seasonalRoutes");
const weatherRoutes = require("./backend/routes/weatherRoutes");
const harvestRoutes = require("./backend/routes/harvestRoutes");
const tipsRoutes = require("./backend/routes/tipsRoutes");
const communityRoutes = require("./backend/routes/communityRoutes");
const errorMiddleware = require("./backend/middleware/errorMiddleware");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// app.options("*", cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Gardening Planner Backend is Running!");
});

app.use("/api/auth", authRoutes);
app.use("/api/plants", plantRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/garden", gardenRoutes);
app.use("/api/pest", pestRoutes);
app.use("/api/seasonal", seasonalRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/harvest", harvestRoutes);
app.use("/api/tips", tipsRoutes);
app.use("/api/community", communityRoutes);

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log("=================================");
  console.log(`Server running at http://localhost:${process.env.PORT}`);
  console.log("=================================");
});