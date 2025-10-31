// controllers/authController.js

const passport = require('passport');
const jwt = require('jsonwebtoken');

async function authorizeLogin(req, res, next) {
  passport.authenticate('local', async (err, user, info) => {
    try {
      if (err || !user) {
        console.log(err);
        const error = new Error('An error occurred.');
        return next(error);
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.isAdmin ? 'admin' : 'user',
          },
          process.env.SECRET,
          {
            expiresIn: '24h',
          }
        );
        return res.json({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.isAdmin ? 'admin' : 'user',
          },
          message: 'User successfully logged in',
        });
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  })(req, res, next);
}

module.exports = { authorizeLogin };
