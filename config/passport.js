// config.passport.js

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const prisma = require('./prismaPool');
const { validatePassword } = require('../validators/userValidators');

passport.use(
  new LocalStrategy(
    { usernameField: 'username', passwordField: 'password' },

    async (username, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { username: username },
        });
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }

        const isValid = await validatePassword(user, password);
        if (!isValid) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user, { message: 'Logged in successfully.' });
      } catch (err) {
        return done(err);
      }
    }
  )
);
