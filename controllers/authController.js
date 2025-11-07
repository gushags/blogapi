// controllers/authController.js

const passport = require('passport');
const jwt = require('jsonwebtoken');

async function authorizeLogin(req, res, next) {
  passport.authenticate('local', async (err, user, info) => {
    try {
      if (err) {
        console.error('Passport error:', err);
        return res
          .status(500)
          .json({ message: 'An internal server error occurred.' });
      }
      if (!user) {
        return res
          .status(401)
          .json({ message: info?.message || 'Invalid credentials' });
      }
      req.login(user, { session: false }, async (loginError) => {
        if (loginError) {
          console.error('Login error:', loginError);
          return res.status(500).json({ message: 'Could not log in user.' });
        }

        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.isAdmin ? 'admin' : 'user',
          },
          process.env.JWT_SECRET,
          {
            expiresIn: '24h',
          }
        );
        return res.status(200).json({
          token,
          user: {
            id: user.id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            avatarUrl: user.avatarUrl,
            role: user.isAdmin ? 'admin' : 'user',
          },
          message: 'User successfully logged in',
        });
      });
    } catch (error) {
      console.error('Authorize login catch error:', error);
      return res.status(500).json({ message: 'An unexpected error occurred.' });
    }
  })(req, res, next);
}

module.exports = { authorizeLogin };
