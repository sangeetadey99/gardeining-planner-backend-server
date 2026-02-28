const supabase = require("../config/supabaseClient");
const { v4: uuidv4 } = require("uuid");

exports.createPost = async (req, res, next) => {
  try {
    const { title, content, tags, images } = req.body;

    const { data, error } = await supabase
      .from("community_posts")
      .insert([
        {
          id: uuidv4(),
          user_id: req.user,
          title,
          content,
          tags: tags || [],
          images: images || [],
          likes: 0,
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    const { limit = 20, offset = 0, sortBy = "created_at" } = req.query;

    const { data, error } = await supabase
      .from("community_posts")
      .select(`
        *,
        users:user_id (name, avatar_url),
        comments:community_comments(count)
      `)
      .order(sortBy, { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;

    const { data, error } = await supabase
      .from("community_posts")
      .update({ title, content, tags })
      .eq("id", id)
      .eq("user_id", req.user)
      .select();

    if (error) throw error;

    res.json(data[0]);
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("community_posts")
      .delete()
      .eq("id", id)
      .eq("user_id", req.user);

    if (error) throw error;

    res.json({ message: "Post deleted" });
  } catch (error) {
    next(error);
  }
};

exports.likePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: post, error: fetchError } = await supabase
      .from("community_posts")
      .select("likes")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    const { data, error } = await supabase
      .from("community_posts")
      .update({ likes: post.likes + 1 })
      .eq("id", id)
      .select();

    if (error) throw error;

    res.json({ likes: data[0].likes });
  } catch (error) {
    next(error);
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const { data, error } = await supabase
      .from("community_comments")
      .insert([
        {
          id: uuidv4(),
          post_id: id,
          user_id: req.user,
          content,
        },
      ])
      .select(`
        *,
        users:user_id (name, avatar_url)
      `);

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

exports.getPostsByTag = async (req, res, next) => {
  try {
    const { tag } = req.params;

    const { data, error } = await supabase
      .from("community_posts")
      .select(`
        *,
        users:user_id (name, avatar_url)
      `)
      .contains("tags", [tag])
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.shareGardenLayout = async (req, res, next) => {
  try {
    const { garden_layout_id, title, description, tags } = req.body;

    const { data: layout, error: layoutError } = await supabase
      .from("garden_layouts")
      .select("*")
      .eq("id", garden_layout_id)
      .eq("user_id", req.user)
      .single();

    if (layoutError) throw layoutError;

    const { data, error } = await supabase
      .from("shared_gardens")
      .insert([
        {
          id: uuidv4(),
          original_layout_id: garden_layout_id,
          user_id: req.user,
          title: title || layout.name,
          description,
          layout_data: layout.layout_data,
          dimensions: layout.dimensions,
          tags: tags || [],
          likes: 0,
        },
      ])
      .select(`
        *,
        users:user_id (name, avatar_url)
      `);

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};
