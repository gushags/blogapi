// validators/authValidator.js

const jwt = require('jsonwebtoken');
const prisma = require('../config/prismaPool');

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log(payload);

    // Async check if the user still exists
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Account no longer exists. Please log in again.' });
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.isAdmin,
    };
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}

async function authenticateAdminToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log(payload);

    // Async check if the user still exists
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Account no longer exists. Please log in again.' });
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.isAdmin,
    };
    if (req.user.role !== 'admin')
      return res
        .status(403)
        .json({ message: 'Only admins may access this route' });

    console.log('req.user: ', req.user); // Current user from JWT
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}

module.exports = { authenticateToken, authenticateAdminToken };
