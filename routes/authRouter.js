const { Router } = require('express');
const authRouter = Router();

// POST /auth/login
authRouter.post('/login', (req, res) => {
  //   const { email, password } = req.body;
  // TODO: validate, check DB, issue token/session
  res.json({ message: 'Login route hit' });
});

// POST /auth/logout
authRouter.post('/logout', (req, res) => {
  // TODO: clear session or revoke token
  res.json({ message: 'Logout route hit' });
});

module.exports = authRouter;
