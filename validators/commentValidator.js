// validators/commentValidators.js

const { body } = require('express-validator');

const validateNewComment = [
  body('content').notEmpty().withMessage('Comment cannot be empty'),
  body('postId')
    .notEmpty()
    .withMessage('Comment must be associated with a postId'),
  body('published').toBoolean().isBoolean(),
];

const validateUpdateComment = [
  body('content')
    .optional({ checkFalsy: true })
    .notEmpty()
    .withMessage('Comment cannot be empty'),
  body('published').optional({ checkFalsy: true }).toBoolean().isBoolean(),
];

module.exports = { validateNewComment, validateUpdateComment };
