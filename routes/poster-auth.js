const express = require("express");
const router = express.Router();
const axios = require("axios");
const authMiddleware = require("../utils/auth-middleware");
const {
  sealAndSetCookie,
  clearAuthCookie,
} = require("../utils/cookie-helpers");
const { UnauthorizedError } = require("../utils/errors");

// Mtas redirects here, token is exchanged and set in cookie, then redirect to FE
router.get("/callback", async (req, res) => {
  let exchangeResponse;
  try {
    exchangeResponse = await axios.post(
      `${process.env.MTAS_URL}/user-auth/exchange-token`,
      {
        authCode: req.query.auth_code,
        appId: process.env.MTAS_APP_ID,
        redirectUri: process.env.MTAS_REDIRECT_URI,
      },
    );
  } catch (err) {
    return res.redirect(
      `${process.env.MTAS_FE_URL}/user/login?redirectUri=${process.env.MTAS_REDIRECT_URI}&appId=${process.env.MTAS_APP_ID}`,
    );
  }

  const { access_token, refresh_token } = exchangeResponse.data;

  await sealAndSetCookie(res, access_token, refresh_token);

  res.redirect(process.env.POSTER_FE_URL);
});

router.post("/logout", authMiddleware, async (req, res) => {
  await axios.post(`${process.env.MTAS_URL}/user-auth/revoke`, {
    refreshToken: req.refreshToken,
  });

  await clearAuthCookie(res);

  res.status(204).end();
});

router.get("/me", authMiddleware, async (req, res) => {
  const { data } = await axios.get(
    `${process.env.MTAS_URL}/user-auth/authenticated-user`,
    {
      headers: {
        Authorization: `Bearer ${req.accessToken}`,
      },
    },
  );

  res.json(data);
});

router.get("/users", authMiddleware, async (req, res) => {
  const { data } = await axios.get(`${process.env.MTAS_URL}/users`, {
    headers: {
      Authorization: `Bearer ${req.accessToken}`,
    },
  });

  res.json(data);
});

module.exports = router;
