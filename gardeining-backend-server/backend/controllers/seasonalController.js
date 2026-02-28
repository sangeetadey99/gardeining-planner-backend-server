const supabase = require("../config/supabaseClient");
const { v4: uuidv4 } = require("uuid");

exports.createSeasonalTask = async (req, res, next) => {
  try {
    const { title, description, season, task_type, due_date, priority } = req.body;

    const { data, error } = await supabase
      .from("seasonal_tasks")
      .insert([
        {
          id: uuidv4(),
          user_id: req.user,
          title,
          description,
          season,
          task_type,
          due_date,
          priority: priority || "medium",
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

exports.getSeasonalTasks = async (req, res, next) => {
  try {
    const { season } = req.query;
    
    let query = supabase
      .from("seasonal_tasks")
      .select("*")
      .eq("user_id", req.user);

    if (season) {
      query = query.eq("season", season);
    }

    const { data, error } = await query.order("due_date", { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.updateSeasonalTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, season, task_type, due_date, priority, status } = req.body;

    const { data, error } = await supabase
      .from("seasonal_tasks")
      .update({ title, description, season, task_type, due_date, priority, status })
      .eq("id", id)
      .eq("user_id", req.user)
      .select();

    if (error) throw error;

    res.json(data[0]);
  } catch (error) {
    next(error);
  }
};

exports.deleteSeasonalTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("seasonal_tasks")
      .delete()
      .eq("id", id)
      .eq("user_id", req.user);

    if (error) throw error;

    res.json({ message: "Seasonal task deleted" });
  } catch (error) {
    next(error);
  }
};

exports.getSeasonalRecommendations = async (req, res, next) => {
  try {
    const currentMonth = new Date().getMonth();
    const seasonNames = ["winter", "spring", "summer", "fall"];
    const currentSeason = seasonNames[Math.floor(currentMonth / 3) % 4];

    const recommendations = {
      spring: [
        { task: "Start seeds indoors", priority: "high", timing: "6-8 weeks before last frost" },
        { task: "Prune dead branches", priority: "medium", timing: "Early spring" },
        { task: "Apply pre-emergent herbicide", priority: "medium", timing: "When soil reaches 55°F" },
        { task: "Test soil pH", priority: "low", timing: "Before planting" },
      ],
      summer: [
        { task: "Water deeply and infrequently", priority: "high", timing: "Early morning" },
        { task: "Monitor for pests", priority: "high", timing: "Weekly" },
        { task: "Deadhead flowers", priority: "medium", timing: "As needed" },
        { task: "Apply mulch", priority: "medium", timing: "After soil warms" },
      ],
      fall: [
        { task: "Clean up garden beds", priority: "high", timing: "After first frost" },
        { task: "Plant spring bulbs", priority: "medium", timing: "6-8 weeks before ground freezes" },
        { task: "Divide perennials", priority: "medium", timing: "Early fall" },
        { task: "Apply winter mulch", priority: "low", timing: "After ground freezes" },
      ],
      winter: [
        { task: "Plan next year's garden", priority: "high", timing: "Indoor activity" },
        { task: "Maintain tools", priority: "medium", timing: "During downtime" },
        { task: "Review seed inventory", priority: "low", timing: "Before ordering" },
        { task: "Protect sensitive plants", priority: "high", timing: "Before first freeze" },
      ],
    };

    res.json({
      current_season: currentSeason,
      recommendations: recommendations[currentSeason] || [],
    });
  } catch (error) {
    next(error);
  }
};
