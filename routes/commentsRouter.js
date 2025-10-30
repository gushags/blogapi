// routes/commentsRouter.js

const { Router } = require('express');
const commentsRouter = Router();

const { validateCommentPost } = require('../validators/commentValidator.js');
const {
  createCommentControl,
} = require('../controllers/commentsController.js');

/**
 *  ----- ROUTES -----
 */

commentsRouter.post('/', validateCommentPost, createCommentControl);

module.exports = commentsRouter;
