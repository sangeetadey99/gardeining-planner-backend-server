const supabase = require("../config/supabaseClient");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const generateToken = require("../utils/generateToken");

exports.registerUser = async (req, res, next) => {
  console.log("Registering user with data:", req.body);
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          id: uuidv4(),
          name,
          email,
          password: hashedPassword,
        },
      ])
      .select();
      console.log("Supabase response:", { data, error });
    if (error) throw error;

    res.status(201).json({
      token: generateToken(data[0].id),
      user: data[0],
    });
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      res.status(400);
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, data.password);

    if (!isMatch) {
      res.status(400);
      throw new Error("Invalid credentials");
    }

    res.json({
      token: generateToken(data.id),
      user: data,
    });
  } catch (error) {
    next(error);
  }
};