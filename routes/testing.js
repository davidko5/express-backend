const Post = require("../models/Post");
const User = require("../models/User");

const router = require("express").Router();

router.post("/reset", async (_, res) => {
  await Post.deleteMany({});

  res.status(204).end();
});

module.exports = router;
