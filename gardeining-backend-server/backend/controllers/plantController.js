const supabase = require("../config/supabaseClient");
const { v4: uuidv4 } = require("uuid");

exports.addPlant = async (req, res, next) => {
  try {
    const { name, type, sunlight, watering_frequency } = req.body;

    const { data, error } = await supabase
      .from("plants")
      .insert([
        {
          id: uuidv4(),
          user_id: req.user,
          name,
          type,
          sunlight,
          watering_frequency,
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

exports.getPlants = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("plants")
      .select("*")
      .eq("user_id", req.user);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.deletePlant = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("plants")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({ message: "Plant deleted" });
  } catch (error) {
    next(error);
  }
};

exports.updatePlant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, type, sunlight } = req.body;

    const { data, error } = await supabase
      .from("plants")
      .update({ name, type, sunlight })
      .eq("id", id)
      .select();

    if (error) throw error;

    res.json(data[0]);
  } catch (error) {
    next(error);
  }
};