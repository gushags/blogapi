// validators/postValidators.js

const { body } = require('express-validator');

const validateNewPost = [
  body('title').notEmpty().withMessage('Title cannot be empty'),
  body('content').notEmpty().withMessage('Post cannot be empty'),
  body('published').isBoolean(),
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
];

module.exports = { validateNewPost, validateUpdatePost };
