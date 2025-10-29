// routes/usersRouter.js
const { Router } = require('express');
const postsRouter = Router();

// Posts
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

// Comments
postsRouter.get('/:postId/comments', (req, res) => {
  const { postId } = req.params;
  res.json({
    data: `This is the GET route for postId: ${postId} with all comments`,
  });
});
postsRouter.post('/:postId/comments', (req, res) => {
  const { postId } = req.params;
  res.json({ data: `This is the POST comment route for postId: ${postId}` });
});
postsRouter.get('/:postId/comments/:commentId', (req, res) => {
  const { postId, commentId } = req.params;
  res.json({
    data: `This is the GET route for commentId ${commentId} of postId: ${postId}`,
  });
});

module.exports = postsRouter;
