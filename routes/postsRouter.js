// routes/usersRouter.js
const { Router } = require('express');
const postsRouter = Router();

postsRouter.get('/', (req, res) => {
  res.json({ data: 'This is the all posts GET route' });
});
postsRouter.get('/:postId', (req, res) => {
  const { postId } = req.params;
  res.json({ data: `This is the posts GET route for postId: ${postId}` });
});
postsRouter.post('/', (req, res) => {
  res.json({ data: 'This is the posts POST route.' });
});
postsRouter.put('/:postId', (req, res) => {
  const { postId } = req.params;
  res.json({ data: `This is the posts PUT route for postId: ${postId}` });
});
postsRouter.delete('/:postId', (req, res) => {
  const { postId } = req.params;
  res.json({ data: `This is the posts DELETE route for postId: ${postId}` });
});

module.exports = postsRouter;
