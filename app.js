// app.js

const express = require('express');
const cors = require('cors');
const passport = require('passport');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();

// Need to require the entire Passport config module so app.js knows about it
require('./config/passport');

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

app.use(passport.initialize());

// Allow CORS
app.use(cors());

/**
 *  ------ ROUTERS ------
 */

const usersRouter = require('./routes/usersRouter');
const postsRouter = require('./routes/postsRouter');
const authRouter = require('./routes/authRouter');

/**
 * ------ ROUTES ------
 */

app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/auth', authRouter);

app.listen(process.env.PORT, (error) => {
  // This is important!
  // Without this, any startup errors will silently fail
  // instead of giving you a helpful error message.
  if (error) {
    throw error;
  }
  console.log(`Blog Api app - listening on port ${process.env.PORT}!`);
});
