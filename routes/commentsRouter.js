// routes/commentsRouter.js

const { Router } = require('express');
const commentsRouter = Router();

const {
  validateNewComment,
  validateUpdateComment,
} = require('../validators/commentValidator.js');
const {
  createCommentControl,
  //   updateCommentControl,
  deleteCommentControl,
} = require('../controllers/commentsController.js');

/**
 *  ----- ROUTES -----
 */

commentsRouter.post('/', validateNewComment, createCommentControl);
// commentsRouter.get('/:commentId', getCommentControl);
// commentsRouter.put('/:commentId', validateUpdateComment, updateCommentControl);
commentsRouter.delete('/:commentId', deleteCommentControl);

module.exports = commentsRouter;
