// validators/commentValidators.js

const { body } = require('express-validator');

const validateCommentPost = [
  body('content').notEmpty().withMessage('Comment cannot be empty'),
  body('published').isBoolean(),
  body('ownerId')
    .notEmpty()
    .withMessage('An owner must be associated with each post.'),
];

module.exports = { validateCommentPost };
