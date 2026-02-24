// jwks-client.js
const jwt = require('jsonwebtoken');
const jwksRsa = require('jwks-rsa');

// configure the JWKS client
const client = jwksRsa({
  jwksUri:
    process.env.NODE_ENV === "production"
      ? process.env.MTAS_JWKS_PROD_URL
      : process.env.MTAS_JWKS_DEV_URL,
  cache: true, // cache keys
  cacheMaxEntries: 5, // up to 5 keys
  cacheMaxAge: 10 * 60 * 1000, // 10 minutes
});

// callback for jsonwebtoken.verify()
function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    const pubKey = key.getPublicKey();
    callback(null, pubKey);
  });
}

/**
 * verifyToken(token) → Promise<decodedPayload>
 */
function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      { algorithms: ['RS256'] },
      (err, decoded) => {
      if (err) return reject(err);
        if (decoded.type !== 'user') {
          return reject(new Error('Invalid token type'));
      }
      resolve(decoded);
      }
    );
  });
}

module.exports = { verifyToken };
