const supabase = require("../config/supabaseClient");
const { v4: uuidv4 } = require("uuid");

exports.addTask = async (req, res, next) => {
  try {
    const { plant_id, task_type, due_date } = req.body;

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          id: uuidv4(),
          plant_id,
          task_type,
          due_date,
          status: "pending",
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .select(`
        id,
        task_type,
        due_date,
        status,
        plant_id,
        plants (
          id,
          name
        )
      `)
      .order("due_date", { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("tasks")
      .update({ status: "completed" })
      .eq("id", id);

    if (error) throw error;

    res.json({ message: "Task completed" });
  } catch (error) {
    next(error);
  }
};