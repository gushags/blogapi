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

const {
  createPostControl,
  deletePostControl,
  getPostsControl,
  getPostControl,
  updatePostControl,
} = require('../controllers/postsController.js');

const {
  getCommentsControl,
  createCommentControl,
  deleteCommentControl,
  updateCommentControl,
} = require('../controllers/commentsController.js');

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
postsRouter.get('/:postId/comments', getCommentsControl);

postsRouter.post('/:postId/comments', validateNewComment, createCommentControl);

postsRouter.put(
  '/:postId/comments/:commentid',
  validateUpdateComment,
  updateCommentControl
);

postsRouter.get('/:postId/comments/:commentId', (req, res) => {
  const { postId, commentId } = req.params;
  res.json({
    data: `This is the GET route for commentId ${commentId} of postId: ${postId}`,
  });
});

postsRouter.delete('/:postId/comments/:commentId', deleteCommentControl);

module.exports = postsRouter;
