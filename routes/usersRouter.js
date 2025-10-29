// routes/usersRouter.js
const { Router } = require('express');
const usersRouter = Router();

usersRouter.get('/', (req, res) => {
  res.json({ data: 'This is the all users GET route' });
});
usersRouter.get('/:userId', (req, res) => {
  const { userId } = req.params;
  res.json({ data: `This is the users GET route for userId: ${userId}` });
});
usersRouter.post('/', (req, res) => {
  res.json({ data: 'This is the users POST route.' });
});
usersRouter.put('/:userId', (req, res) => {
  const { userId } = req.params;
  res.json({ data: `This is the users PUT route for userId: ${userId}` });
});
usersRouter.delete('/:userId', (req, res) => {
  const { userId } = req.params;
  res.json({ data: `This is the users DELETE route for userId: ${userId}` });
});

module.exports = usersRouter;
