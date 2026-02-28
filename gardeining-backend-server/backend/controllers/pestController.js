const supabase = require("../config/supabaseClient");
const { v4: uuidv4 } = require("uuid");

exports.logPestIssue = async (req, res, next) => {
  try {
    const { plant_id, pest_type, severity, symptoms, treatment, status } = req.body;
    
    console.log("Pest issue data:", { plant_id, pest_type, severity, symptoms, treatment, status });
    console.log("User ID:", req.user);

    const { data, error } = await supabase
      .from("pest_issues")
      .insert([
        {
          id: uuidv4(),
          user_id: req.user,
          plant_id,
          pest_type,
          severity,
          symptoms,
          treatment,
          status: status || "active",
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    console.log("Supabase response:", data);
    res.status(201).json(data);
  } catch (error) {
    console.error("Controller error:", error);
    next(error);
  }
};

exports.getPestIssues = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("pest_issues")
      .select(`
        *,
        plants:plant_id (name, type)
      `)
      .eq("user_id", req.user)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.updatePestIssue = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { pest_type, severity, symptoms, treatment, status } = req.body;

    const { data, error } = await supabase
      .from("pest_issues")
      .update({ pest_type, severity, symptoms, treatment, status })
      .eq("id", id)
      .eq("user_id", req.user)
      .select();

    if (error) throw error;

    res.json(data[0]);
  } catch (error) {
    next(error);
  }
};

exports.deletePestIssue = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("pest_issues")
      .delete()
      .eq("id", id)
      .eq("user_id", req.user);

    if (error) throw error;

    res.json({ message: "Pest issue deleted" });
  } catch (error) {
    next(error);
  }
};

exports.getPestAlerts = async (req, res, next) => {
  try {
    const currentSeason = new Date().getMonth();
    const commonPests = [
      {
        season: "spring",
        pests: [
          { type: "Aphids", prevention: "Use neem oil spray" },
          { type: "Spider Mites", prevention: "Maintain proper humidity" },
        ],
      },
      {
        season: "summer",
        pests: [
          { type: "Whiteflies", prevention: "Use yellow sticky traps" },
          { type: "Caterpillars", prevention: "Hand pick and use Bt" },
        ],
      },
      {
        season: "fall",
        pests: [
          { type: "Slugs", prevention: "Use beer traps or copper barriers" },
          { type: "Scale Insects", prevention: "Apply horticultural oil" },
        ],
      },
      {
        season: "winter",
        pests: [
          { type: "Fungus Gnats", prevention: "Let soil dry between waterings" },
          { type: "Mealybugs", prevention: "Inspect new plants before bringing indoors" },
        ],
      },
    ];

    const seasonNames = ["winter", "spring", "summer", "fall"];
    const currentSeasonName = seasonNames[Math.floor(currentSeason / 3) % 4];
    
    const alerts = commonPests.find(p => p.season === currentSeasonName)?.pests || [];

    res.json({ season: currentSeasonName, alerts });
  } catch (error) {
    next(error);
  }
};
