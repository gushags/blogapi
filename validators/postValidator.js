// validators/postValidators.js

const { body } = require('express-validator');

const validateNewPost = [
  body('title').notEmpty().withMessage('Title cannot be empty'),
  body('content').notEmpty().withMessage('Post cannot be empty'),
  body('published').isBoolean(),
  body('authorId')
    .notEmpty()
    .withMessage('An author must be associated with each post.'),
];

const validateUpdatePost = [
  body('title')
    .optional({ checkFalsy: true })
    .notEmpty()
    .withMessage('Title cannot be empty'),
  body('content')
    .optional({ checkFalsy: true })
    .notEmpty()
    .withMessage('Post cannot be empty'),
  body('published').optional({ checkFalsy: true }).isBoolean(),
  body('authorId')
    .optional({ checkFalsy: true })
    .notEmpty()
    .withMessage('An author must be associated with each post.'),
];

module.exports = { validateNewPost, validateUpdatePost };
