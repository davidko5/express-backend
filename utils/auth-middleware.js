const { verifyToken } = require('./jwks-client');

module.exports = async function authMiddleware(req, res, next) {
  try {
    let token;
    const auth = req.headers.authorization || '';
    if (auth.startsWith('Bearer ')) {
      token = auth.slice(7);
    }

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // verify & attach user
    const payload = await verifyToken(token);
    req.user = {
      id: payload.sub || payload.id,
      email: payload.email,
      type: payload.type,
    };

    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
