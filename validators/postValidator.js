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

module.exports = { validateNewPost };
