const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  commenter_id: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const PostsSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  author_id: {
    type: String,
    required: true,
  },
  comments: [CommentSchema],
});

const PostModel = mongoose.model("posts", PostsSchema);
module.exports = PostModel;
