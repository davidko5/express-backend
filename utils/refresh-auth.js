const axios = require("axios");
const { sealAndSetCookie, clearAuthCookie } = require("./cookie-helpers");
const { verifyToken } = require("./jwks-client");
const { UnauthorizedError } = require("./errors");
const { mtasConfidentialAxios } = require("./mtas-confidential-axios");

const refreshInFlight = new Map();

// Dedups concurrent refreshes so MTAS is hit once (avoids tripping replay
// detection). First caller's `res` is reused — one clear-cookie header is
// enough since cookies are browser-global per domain.
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
    const refreshResponse = await mtasConfidentialAxios.post(
      `${process.env.MTAS_URL}/user-auth/refresh-token`,
      {
        refreshToken: refreshToken,
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
