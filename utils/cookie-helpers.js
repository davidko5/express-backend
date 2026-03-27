const { sealData, unsealData } = require("iron-session");

const POSTER_AUTH_COOKIE_NAME = "auth";

async function unsealCookie(cookie) {
  const unsealed = await unsealData(cookie, {
    password: process.env.ENCRYPTION_PASSWORD,
  });

  return {
    accessToken: unsealed.access_token,
    refreshToken: unsealed.refresh_token,
  };
}

async function sealAndSetCookie(res, accessToken, refreshToken) {
  const sealed = await sealData(
    { access_token: accessToken, refresh_token: refreshToken },
    {
      password: process.env.ENCRYPTION_PASSWORD,
    },
  );

  res.cookie(POSTER_AUTH_COOKIE_NAME, sealed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

async function clearAuthCookie(res) {
  res.clearCookie(POSTER_AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

module.exports = {
  unsealCookie,
  sealAndSetCookie,
  clearAuthCookie,
  POSTER_AUTH_COOKIE_NAME,
};
