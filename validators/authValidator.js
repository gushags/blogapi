// validators/authValidator.js

const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) return res.status(401).json({ message: 'Missing token' });

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user; // now available in route handlers
    console.log('req.user: ', req.user); // Current user from JWT
    next();
  });
}

module.exports = { authenticateToken };
