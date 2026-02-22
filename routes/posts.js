const express = require("express");
const Post = require("../models/Post");
const authMiddleware = require("../utils/auth-middleware");
const router = express.Router();

router.get("/list", async (req, res) => {
  try {
    let posts = await Post.find().populate([
      "authorId",
      "comments.authorId",
      "comments.replies.authorId",
    ]);
    res.status(200).json({
      status: 200,
      data: posts,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

router.get("/:postId", async (req, res) => {
  try {
    let post = await Post.findOne({
      _id: req.params.postId,
    });
    if (post) {
      res.status(200).json({
        status: 200,
        data: post,
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "No post found",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

router.post("/add", authMiddleware, async (req, res) => {
  try {
    let post = new Post(req.body);
    post = await post.save();
    res.status(200).json({
      status: 200,
      data: post,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

router.put("/add/:postId", authMiddleware, async (req, res) => {
  // add comment to post by postId
  try {
    let post = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $push: {
          comments: req.body,
        },
      },
      {
        new: true,
      }
    );
    if (post) {
      res.status(200).json({
        status: 200,
        data: post,
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "No post found",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

router.put("/add/:postId/:commentId",  authMiddleware, async (req, res) => {
  // add reply to comment in post by postId and commentId
  const body = { ...req.body, createdAt: new Date(), updatedAt: new Date() };
  try {
    let post = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $push: {
          "comments.$[comment].replies": body,
        },
      },
      { arrayFilters: [{ "comment._id": req.params.commentId }] },
      {
        new: true,
      }
    );
    if (post) {
      res.status(200).json({
        status: 200,
        data: post,
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "No post found",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

router.put("/edit/:postId", authMiddleware,  async (req, res) => {
  // edit post by id
  try {
    let post = await Post.findByIdAndUpdate(req.params.postId, req.body, {
      new: true,
    });
    if (post) {
      res.status(200).json({
        status: 200,
        data: post,
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "No post found",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

router.put("/edit/:postId/:commentId", authMiddleware,  async (req, res) => {
  try {
    let post = await Post.findOneAndUpdate(
      { _id: req.params.postId },
      {
        $set: {
          "comments.$[comment].content": req.body.content,
          "comments.$[comment].score": req.body.score,
        },
      },
      { arrayFilters: [{ "comment._id": req.params.commentId }] },
      { new: true }
    );
    if (post) {
      res.status(200).json({
        status: 200,
        data: post,
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "No post found",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

router.put("/edit/:postId/:commentId/:replyId", authMiddleware, async (req, res) => {
  try {
    let post = await Post.findOneAndUpdate(
      { _id: req.params.postId },
      {
        $set: {
          "comments.$[comment].replies.$[reply].content": req.body.content,
          "comments.$[comment].replies.$[reply].score": req.body.score,
          "comments.$[comment].replies.$[reply].updatedAt": new Date(),
        },
      },
      {
        arrayFilters: [
          { "comment._id": req.params.commentId },
          { "reply._id": req.params.replyId },
        ],
      },
      { new: true }
    );
    if (post) {
      res.status(200).json({
        status: 200,
        data: post,
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "No post found",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

router.put("/delete/:postId/:commentId", authMiddleware, async (req, res) => {
  // delete comment of post by postId and commentId
  try {
    let post = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $pull: {
          comments: { _id: req.params.commentId },
        },
      },
      {
        new: true,
      }
    );
    if (post) {
      res.status(200).json({
        status: 200,
        data: post,
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "No post found",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

router.put("/delete/:postId/:commentId/:replyId", authMiddleware, async (req, res) => {
  try {
    let post = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $pull: {
          "comments.$[comment].replies": { _id: req.params.replyId },
        },
      },
      { arrayFilters: [{ "comment._id": req.params.commentId }] },
      {
        new: true,
      }
    );
    if (post) {
      res.status(200).json({
        status: 200,
        data: post,
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "No post found",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

router.delete("/delete/:postId", authMiddleware, async (req, res) => {
  try {
    let post = await Post.findByIdAndDelete(req.params.postId);
    if (post) {
      res.status(200).json({
        status: 200,
        message: "Post deleted successfully",
        id: req.params.postId,
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "No post found",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

module.exports = router;
