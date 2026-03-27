const axios = require("axios");
const { sealAndSetCookie, clearAuthCookie } = require("./cookie-helpers");
const { verifyToken } = require("./jwks-client");
const { UnauthorizedError } = require("./errors");

const refreshInFlight = new Map();

async function refreshAuthTokens(res, refreshToken) {
  if (refreshInFlight.has(refreshToken)) {
    return refreshInFlight.get(refreshToken);
  }

  const promise = actualRefresh(res, refreshToken).finally(() => {
    refreshInFlight.delete(refreshToken);
  });

  refreshInFlight.set(refreshToken, promise);
  return await promise;
}

async function actualRefresh(res, refreshToken) {
  try {
    const refreshResponse = await axios.post(
      `${process.env.MTAS_URL}/user-auth/refresh-token`,
      {
        refreshToken: refreshToken,
        appId: process.env.MTAS_APP_ID,
      },
    );
    const { access_token: newAccessToken, refresh_token: newRefreshToken } =
      refreshResponse.data;

    const verifyTokenPayload = await verifyToken(newAccessToken);

    return { verifyTokenPayload, newAccessToken, newRefreshToken };
  } catch (err) {
    clearAuthCookie(res);
    throw new UnauthorizedError("refresh_failed");
  }
}

module.exports = { refreshAuthTokens };
