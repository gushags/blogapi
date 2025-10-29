// app.js

const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();

app.use(cors());

/**
 *  ------ ROUTERS ------
 */

const usersRouter = require('./routes/usersRouter');
const postsRouter = require('./routes/postsRouter');

/**
 * ------ ROUTES ------
 */
app.get('/', (req, res) => {
  res.json({
    data: {
      user: 'jeff',
      message: 'Hello World!',
      comment: 'Ridiculous.',
    },
  });
});

app.use('/users', usersRouter);
app.use('/posts', postsRouter);

app.listen(process.env.PORT, (error) => {
  // This is important!
  // Without this, any startup errors will silently fail
  // instead of giving you a helpful error message.
  if (error) {
    throw error;
  }
  console.log(`Blog Api app - listening on port ${process.env.PORT}!`);
});
