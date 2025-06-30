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
    authorId: {
      type: String,
      required: true,
    },
    repliedTo: {
      type: String,
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
    authorId: {
      type: String,
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
    authorId: {
      type: String,
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
