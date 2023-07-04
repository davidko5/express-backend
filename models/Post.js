const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let ReplySchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    repliedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  { timestamps: true }
);

let CommentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    replies: [ReplySchema],
  },
  { timestamps: true }
);

let PostSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    comments: [CommentSchema],
  },
  { timestamps: true }
);

let Post = mongoose.model("post", PostSchema);

module.exports = Post;
