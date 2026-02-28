const express = require("express");
const router = express.Router();

const {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  likePost,
  addComment,
  getPostsByTag,
  shareGardenLayout,
} = require("../controllers/communityController");

const protect = require("../middleware/authMiddleware");

router.post("/posts", protect, createPost);
router.get("/posts", protect, getPosts);
router.put("/posts/:id", protect, updatePost);
router.delete("/posts/:id", protect, deletePost);
router.post("/posts/:id/like", protect, likePost);
router.post("/posts/:id/comments", protect, addComment);
router.get("/posts/tag/:tag", protect, getPostsByTag);
router.post("/share-layout", protect, shareGardenLayout);

module.exports = router;
