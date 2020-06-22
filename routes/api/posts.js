const express = require("express");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

const router = express.Router();

//POST api/posts
//Create a post
//Private route
router.post(
  "/",
  [auth, [check("text", "Text cannot be empty").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//GET api/posts
//GET all posts
//Private route
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//GET api/posts/:id
//GET  posts by id
//Private route
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post Not found" });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post Not found" });
    }
    res.status(500).send("Server Error");
  }
});

//DELETE api/posts/:id
//DELETE  post by id
//Private route
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post Not found" });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Unauthorized user" });
    }

    await post.remove();

    res.json({ msg: "Post removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post Not found" });
    }
    res.status(500).send("Server Error");
  }
});

//PUT api/posts/like/:id
//Like  post by id
//Private route
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //check if post is already liked by this user
    if (post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: "Post already liked" });
    }
    //unshift puts it at the begining
    post.likes.unshift({ user: req.user.id });
    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//PUT api/posts/unlike/:id
//Like  post by id
//Private route
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    //Get a post
    const post = await Post.findById(req.params.id);

    //check if post has not been liked
    if (!post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: "Post has not been liked" });
    }

    //unshift puts it at the begining
    post.likes = post.likes.filter(
      ({ user }) => user.toString() !== req.user.id
    );
    await post.save();

    return res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//POST api/post/comments/:id
//Create a comment on a post
//Private route
router.post(
  "/comment/:id",
  [auth, [check("text", "Text cannot be empty").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      post.comments.unshift(newComment);
      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//DELETE api/posts/comment/:id/:comment_id
//DELETE  comment
//Private route
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post Not found" });
    }

    //Get the comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    //Check if comment exists
    if (!comment) {
      return res.status(401).json({ msg: "Comment not found" });
    }

    //Check if user is the one that made the comment
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Unauthorized user" });
    }

    //unshift puts it at the begining
    post.comments = post.comments.filter(
      ({ id }) => id.toString() !== req.params.comment_id
    );
    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post Not found" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
