const supabase = require("../config/supabaseClient");
const { v4: uuidv4 } = require("uuid");

exports.createGardenLayout = async (req, res, next) => {
  try {
    const { name, layout_data, dimensions, notes } = req.body;

    const { data, error } = await supabase
      .from("garden_layouts")
      .insert([
        {
          id: uuidv4(),
          user_id: req.user,
          name,
          layout_data,
          dimensions,
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

exports.getGardenLayouts = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("garden_layouts")
      .select("*")
      .eq("user_id", req.user)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.getGardenLayoutById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("garden_layouts")
      .select("*")
      .eq("id", id)
      .eq("user_id", req.user)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.updateGardenLayout = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, layout_data, dimensions, notes } = req.body;

    const { data, error } = await supabase
      .from("garden_layouts")
      .update({ name, layout_data, dimensions, notes })
      .eq("id", id)
      .eq("user_id", req.user)
      .select();

    if (error) throw error;

    res.json(data[0]);
  } catch (error) {
    next(error);
  }
};

exports.deleteGardenLayout = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("garden_layouts")
      .delete()
      .eq("id", id)
      .eq("user_id", req.user);

    if (error) throw error;

    res.json({ message: "Garden layout deleted" });
  } catch (error) {
    next(error);
  }
};
