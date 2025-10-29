// validators/userValidators.js

const { body } = require('express-validator');
const bcrypt = require('bcrypt');
const prisma = require('../config/prismaPool');

const validateNewUser = [
  body('firstname')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isAlpha()
    .withMessage('Only letters are allowed in first names'),
  body('lastname')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isAlpha()
    .withMessage('Only letters are allowed in last names'),
  body('username')
    .trim()
    .notEmpty()
    .custom(async (value) => {
      const user = await prisma.user.findUnique({ where: { username: value } });
      if (user) {
        throw new Error('Username already in use');
      }
    }),
  body('email')
    .isEmail()
    .withMessage('Valid email required')
    .custom(async (value) => {
      const user = await prisma.user.findUnique({ where: { email: value } });
      if (user) {
        throw new Error('E-mail already in use');
      }
    }),
  body('pwd')
    .isLength({ min: 5 })
    .withMessage('Password must be at least 5 characters'),
];

async function validatePassword(user, password) {
  return bcrypt.compare(password, user.pwd);
}

const validateUpdateUser = [
  body('firstname')
    .optional({ checkFalsy: true })
    .notEmpty()
    .trim()
    .isAlpha()
    .withMessage('Only letters are allowed in first names'),
  body('lastname')
    .optional({ checkFalsy: true })
    .notEmpty()
    .trim()
    .isAlpha()
    .withMessage('Only letters are allowed in last names'),
  body('username')
    .optional({ checkFalsy: true })
    .notEmpty()
    .trim()
    .custom(async (value) => {
      const user = await prisma.user.findUnique({ where: { username: value } });
      if (user) {
        throw new Error('Username already in use');
      }
    }),
  body('email')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('Valid email required')
    .custom(async (value) => {
      const user = await prisma.user.findUnique({ where: { email: value } });
      if (user) {
        throw new Error('E-mail already in use');
      }
    }),
  body('pwd')
    .optional({ checkFalsy: true })
    .isLength({ min: 5 })
    .withMessage('Password must be at least 5 characters'),
];

module.exports = { validateNewUser, validateUpdateUser, validatePassword };
