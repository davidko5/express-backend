const express = require('express');
const router = express.Router();

router.get('/wakey-wakey', async (_, res) => {
  try {
    res.status(200).json({
      status: 200,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

router.get('/health', (_, res) => {
  res.send('ok');
});

module.exports = router;
