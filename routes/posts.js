require("dotenv").config();
const express = require("express");
const postsRouter = express.Router();
const mongoose = require("mongoose");
const PostsModel = require("../models/Posts");

mongoose
  .connect(`${process.env.DATABASE_URL}`)
  .then(console.log("Successfully connected to database"))
  .catch((err) => console.log(err));

postsRouter.get("/getAllPosts", async (req, res) => {
  console.log("Getting all posts");

  try {
    const posts = await PostsModel.find({});
    res.json(posts);
  } catch (err) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Internal Server Error Occured Whilst Getting Data" });
  }
});

postsRouter.post("/createPost", async (req, res) => {
  const { content, author_id } = req.body;

  if (!content || !author_id)
    return res.status(400).json({ error: "Missing required fields" });

  const newPost = new PostsModel({
    content: content,
    author_id: author_id,
    comments: [],
  });

  try {
    await newPost.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }

  return res.status(200).json({ message: "Successfully created new post" });
});

postsRouter.put("/comment", async (req, res) => {
  const { content, commenator_id, post_id } = req.body;

  if (!content || !commenator_id || !post_id)
    return res.status(400).json({ error: "Missing required fields" });

  try {
    const post = await PostsModel.findById(post_id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    post.comments.push({
      commenter_id: commenator_id,
      content: content,
    });

    const updatedPost = await post.save();

    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

postsRouter.delete("/deleteComment", async (req, res) => {
  const { comment_id, post_id, user_id } = req.body;

  if (!comment_id || !post_id || !user_id)
    return res.status(400).json({ error: "Missing required fields" });

  try {
    const post = await PostsModel.findById(post_id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = await post.comments.id(comment_id);

    if (!comment) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (user_id !== comment.commenter_id && user_id !== post.author_id) {
      return res.status(403).json({ error: "Insufficient authorization" });
    }

    await comment.deleteOne();

    await post.save();

    res.json({ message: "Comment successfully deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

postsRouter.get("/", (req, res) => {
  console.log("Received a request");
});

module.exports = postsRouter;
