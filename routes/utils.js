const express = require("express");
const router = express.Router();

router.get("/wakey-wakey", async (req, res) => {
  try {
    res.status(200).json({
      status: 200,
      // data: "",
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

module.exports = router;
