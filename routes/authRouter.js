const { Router } = require('express');
const authRouter = Router();
const { authorizeLogin } = require('../controllers/authController');

// POST /auth/login
authRouter.post('/login', authorizeLogin);

// POST /auth/logout
authRouter.post('/logout', (req, res) => {
  // TODO: clear session or revoke token
  res.json({ message: 'Logout route hit' });
});

module.exports = authRouter;
