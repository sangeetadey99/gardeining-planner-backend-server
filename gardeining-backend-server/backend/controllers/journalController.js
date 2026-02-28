const supabase = require("../config/supabaseClient");
const { v4: uuidv4 } = require("uuid");

exports.addJournal = async (req, res, next) => {
  try {
    const { plant_id, note } = req.body;

    const { data, error } = await supabase
      .from("journal_entries")
      .insert([
        {
          id: uuidv4(),
          plant_id,
          note,
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

exports.getJournal = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("journal_entries")
      .select("*");

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
};