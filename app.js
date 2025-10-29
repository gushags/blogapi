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
// app.get('/session', (req, res) => {
//   return res.send(req.context.models.users[req.context.me.id]);
// });

// app.get('/users/:userId', (req, res) => {
//   return res.send(req.context.models.users[req.params.userId]);
// });

// app.get('/messages', (req, res) => {
//   return res.send(Object.values(req.context.models.messages));
// });

// app.get('/messages/:messageId', (req, res) => {
//   return res.send(req.context.models.messages[req.params.messageId]);
// });

// app.post('/messages', (req, res) => {
//   const id = uuidv4();
//   const message = {
//     id,
//     text: req.body.text,
//     userId: req.context.me.id,
//   };

//   req.context.models.messages[id] = message;

//   return res.send(message);
// });

// app.post('/users', (req, res) => {
//   return res.send('POST HTTP method on user resource');
// });

// app.put('/users/:userId', (req, res) => {
//   return res.send(`PUT HTTP method on user/${req.params.userId} resource`);
// });

// app.delete('/users/:userId', (req, res) => {
//   return res.send(`DELETE HTTP method on user/${req.params.userId} resource`);
// });

// app.delete('/messages/:messageId', (req, res) => {
//   // This deletes the message corresponding to messageId
//   // by splitting the messages object into two parts. One is the
//   // messageId to be deleted, and the rest is represented by the spread
//   // operator and 'otherMessages'. To delete messageId, he simply sets
//   // messages = to otherMessages, which excludes the messageId he wants
//   // to delete.
//   const { [req.params.messageId]: message, ...otherMessages } =
//     req.context.models.messages;

//   req.context.models.messages = otherMessages;

//   return res.send(message);
// });

app.listen(process.env.PORT, (error) => {
  // This is important!
  // Without this, any startup errors will silently fail
  // instead of giving you a helpful error message.
  if (error) {
    throw error;
  }
  console.log(`Blog Api app - listening on port ${process.env.PORT}!`);
});
