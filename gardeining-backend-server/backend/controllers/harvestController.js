const supabase = require("../config/supabaseClient");
const { v4: uuidv4 } = require("uuid");

exports.createHarvestPlan = async (req, res, next) => {
  try {
    const { plant_id, expected_yield, expected_date, notes } = req.body;

    const { data, error } = await supabase
      .from("harvest_plans")
      .insert([
        {
          id: uuidv4(),
          user_id: req.user,
          plant_id,
          expected_yield,
          expected_date,
          notes,
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

exports.getHarvestPlans = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("harvest_plans")
      .select(`
        *,
        plants:plant_id (name, type, planted_date)
      `)
      .eq("user_id", req.user)
      .order("expected_date", { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.updateHarvestPlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { plant_id, expected_yield, expected_date, notes, status } = req.body;

    const { data, error } = await supabase
      .from("harvest_plans")
      .update({ plant_id, expected_yield, expected_date, notes, status })
      .eq("id", id)
      .eq("user_id", req.user)
      .select();

    if (error) throw error;

    res.json(data[0]);
  } catch (error) {
    next(error);
  }
};

exports.deleteHarvestPlan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("harvest_plans")
      .delete()
      .eq("id", id)
      .eq("user_id", req.user);

    if (error) throw error;

    res.json({ message: "Harvest plan deleted" });
  } catch (error) {
    next(error);
  }
};

exports.logHarvest = async (req, res, next) => {
  try {
    const { plant_id, actual_yield, quality_notes, harvest_date } = req.body;

    const { data, error } = await supabase
      .from("harvest_logs")
      .insert([
        {
          id: uuidv4(),
          user_id: req.user,
          plant_id,
          actual_yield,
          quality_notes,
          harvest_date: harvest_date || new Date().toISOString().split('T')[0],
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

exports.getHarvestHistory = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("harvest_logs")
      .select(`
        *,
        plants:plant_id (name, type)
      `)
      .eq("user_id", req.user)
      .order("harvest_date", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.predictHarvest = async (req, res, next) => {
  try {
    const { plantId } = req.params;

    const { data: plant, error: plantError } = await supabase
      .from("plants")
      .select("*")
      .eq("id", plantId)
      .eq("user_id", req.user)
      .single();

    if (plantError) throw plantError;

    const harvestTimeframes = {
      "tomato": { min: 60, max: 80, unit: "days" },
      "lettuce": { min: 30, max: 60, unit: "days" },
      "carrot": { min: 70, max: 80, unit: "days" },
      "pepper": { min: 60, max: 90, unit: "days" },
      "cucumber": { min: 50, max: 70, unit: "days" },
      "beans": { min: 50, max: 65, unit: "days" },
      "herbs": { min: 30, max: 60, unit: "days" },
      "default": { min: 60, max: 90, unit: "days" },
    };

    const plantType = plant.type.toLowerCase();
    const timeframe = harvestTimeframes[plantType] || harvestTimeframes.default;

    const plantedDate = plant.planted_date ? new Date(plant.planted_date) : new Date();
    const minHarvestDate = new Date(plantedDate.getTime() + timeframe.min * 24 * 60 * 60 * 1000);
    const maxHarvestDate = new Date(plantedDate.getTime() + timeframe.max * 24 * 60 * 60 * 1000);

    const prediction = {
      plant_id: plantId,
      plant_name: plant.name,
      plant_type: plant.type,
      estimated_harvest_window: {
        earliest: minHarvestDate.toISOString().split('T')[0],
        latest: maxHarvestDate.toISOString().split('T')[0],
        timeframe: `${timeframe.min}-${timeframe.max} ${timeframe.unit}`,
      },
      growth_progress: Math.min(100, Math.round(((Date.now() - plantedDate.getTime()) / (timeframe.min * 24 * 60 * 60 * 1000)) * 100)),
    };

    res.json(prediction);
  } catch (error) {
    next(error);
  }
};
