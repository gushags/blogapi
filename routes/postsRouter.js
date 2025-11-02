// routes/usersRouter.js
const { Router } = require('express');
const postsRouter = Router();
const {
  validateNewPost,
  validateUpdatePost,
} = require('../validators/postValidator.js');

const {
  validateNewComment,
  validateUpdateComment,
} = require('../validators/commentValidator.js');

const { authenticateToken } = require('../validators/authValidator.js');

const {
  createPostControl,
  deletePostControl,
  getPostsControl,
  getPostControl,
  updatePostControl,
} = require('../controllers/postsController.js');

const {
  getCommentsControl,
  getSingleCommentControl,
  createCommentControl,
  deleteCommentControl,
  updateCommentControl,
} = require('../controllers/commentsController.js');

/**
 *  ----- POSTS ROUTES -----
 */

// Get all posts
postsRouter.get('/', getPostsControl);

// Get individual post
postsRouter.get('/:postId', getPostControl);

// Create new post
postsRouter.post('/', validateNewPost, authenticateToken, createPostControl);

// Update a post
postsRouter.put(
  '/:postId',
  validateUpdatePost,
  authenticateToken,
  updatePostControl
);

// Delete post
postsRouter.delete('/:postId', authenticateToken, deletePostControl);

/**
 *  ----- COMMENTS ROUTES -----
 */

// Get all comments
postsRouter.get('/:postId/comments', getCommentsControl);

// Create a comment
postsRouter.post(
  '/:postId/comments',
  validateNewComment,
  authenticateToken,
  createCommentControl
);

// Update a comment
postsRouter.put(
  '/:postId/comments/:commentId',
  validateUpdateComment,
  authenticateToken,
  updateCommentControl
);

postsRouter.get('/:postId/comments/:commentId', getSingleCommentControl);

// Todo update controller -- user must be comment author
postsRouter.delete(
  '/:postId/comments/:commentId',
  authenticateToken,
  deleteCommentControl
);

module.exports = postsRouter;
