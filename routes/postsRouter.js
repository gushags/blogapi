// routes/usersRouter.js
const { Router } = require('express');
const postsRouter = Router();
const {
  validateNewPost,
  validateUpdatePost,
} = require('../validators/postValidator');

const {
  createPostControl,
  deletePostControl,
  getPostsControl,
  getPostControl,
  updatePostControl,
} = require('../controllers/postsController');

/**
 *  ----- ROUTES -----
 */

// Get all posts
postsRouter.get('/', getPostsControl);

// Get individual post
postsRouter.get('/:postId', getPostControl);

// Create new post
postsRouter.post('/', validateNewPost, createPostControl);

// Update a post
postsRouter.put('/:postId', validateUpdatePost, updatePostControl);

// Delete post
postsRouter.delete('/:postId', deletePostControl);

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
