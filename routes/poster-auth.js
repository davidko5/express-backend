const express = require("express");
const router = express.Router();
const axios = require("axios");
const authMiddleware = require("../utils/auth-middleware");
const {
  sealAndSetCookie,
  clearAuthCookie,
} = require("../utils/cookie-helpers");
const { UnauthorizedError } = require("../utils/errors");
const { mtasConfidentialAxios } = require("../utils/mtas-confidential-axios");
const crypto = require("crypto");

router.get("/login", (req, res) => {
  // State that ties login flow to its caller. Used to prevent "login CSRF" attacks
  const state = crypto.randomUUID();
  res.cookie("oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 10 * 60 * 1000, // 10 mins
  });

  return res.redirect(
    `${process.env.MTAS_FE_URL}/user/login?redirectUri=${process.env.MTAS_REDIRECT_URI}&appId=${process.env.MTAS_APP_ID}&state=${state}`,
  );
});

// Mtas redirects here, token is exchanged and set in cookie, then redirect to FE
router.get("/callback", async (req, res) => {
  // Validate state to prevent "login CSRF" attacks
  const { state: queryState } = req.query;
  const cookieState = req.cookies.oauth_state;
  if (!cookieState || cookieState !== queryState) {
    req.log.warn("oauth state mismatch on callback");
    return res.redirect('/auth/login');
  }

  // Clear the state cookie to prevent reuse and since not needed anymore
  res.clearCookie("oauth_state");
  
  let exchangeResponse;
  try {
    exchangeResponse = await mtasConfidentialAxios.post(
      `${process.env.MTAS_URL}/user-auth/exchange-token`,
      {
        authCode: req.query.auth_code,
        redirectUri: process.env.MTAS_REDIRECT_URI,
      },
    );
  } catch (err) {
    req.log.error(
      { status: err.response?.status, data: err.response?.data },
      "token exchange failed",
    );
    return res.redirect('/auth/login');
  }
  
  const { access_token, refresh_token } = exchangeResponse.data;
  await sealAndSetCookie(res, access_token, refresh_token);

  res.redirect(process.env.POSTER_FE_URL);
});

router.post("/logout", authMiddleware, async (req, res) => {
  await mtasConfidentialAxios.post(`${process.env.MTAS_URL}/user-auth/revoke`, {
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
