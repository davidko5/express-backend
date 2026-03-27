const { verifyToken } = require("./jwks-client");
const { unsealCookie, sealAndSetCookie } = require("./cookie-helpers");
const { refreshAuthTokens } = require("./refresh-auth");
const { UnauthorizedError } = require("./errors");

module.exports = async function authMiddleware(req, res, next) {
  const authCookies = req.cookies.auth;

  if (!authCookies) {
    throw new UnauthorizedError("no_cookie");
  }

  try {
    const { accessToken, refreshToken } = await unsealCookie(authCookies);
    req.accessToken = accessToken;
    req.refreshToken = refreshToken;
  } catch (err) {
    throw new UnauthorizedError();
  }

  let verifyTokenPayload;
  try {
    // verify & attach user
    verifyTokenPayload = await verifyToken(req.accessToken);
  } catch (err) {
    // Probably token expired, try refreshing
    const {
      verifyTokenPayload: newVerifyTokenPayload,
      newAccessToken,
      newRefreshToken,
    } = await refreshAuthTokens(res, req.refreshToken);

    verifyTokenPayload = newVerifyTokenPayload;
    req.accessToken = newAccessToken;
    req.refreshToken = newRefreshToken;
    await sealAndSetCookie(res, newAccessToken, newRefreshToken);
  }

  req.user = {
    id: verifyTokenPayload.id,
    aud: verifyTokenPayload.aud,
    type: verifyTokenPayload.type,
  };

  next();
};
