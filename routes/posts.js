const express = require("express");
const Post = require("../models/Post");
const router = express.Router();

router.get("/list", async (req, res) => {
  try {
    let posts = await Post.find().populate([
      "author",
      "comments.author",
      "comments.replies.author",
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

router.post("/add", async (req, res) => {
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

router.put("/add/:postId", async (req, res) => {
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

router.put("/add/:postId/:commentId", async (req, res) => {
  // add reply to comment in post by postId and commentId
  const body = { ...req.body, createdAt: new Date(), updatedAt: new Date() };
  console.log(body);
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

router.put("/edit/:postId", async (req, res) => {
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

router.put("/edit/:postId/:commentId", async (req, res) => {
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

router.put("/edit/:postId/:commentId/:replyId", async (req, res) => {
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

router.put("/delete/:postId/:commentId", async (req, res) => {
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

router.put("/delete/:postId/:commentId/:replyId", async (req, res) => {
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

router.delete("/delete/:postId", async (req, res) => {
  try {
    let post = await Post.findByIdAndRemove(req.params.postId);
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
