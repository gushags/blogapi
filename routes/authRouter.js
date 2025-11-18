const { Router } = require('express');
const authRouter = Router();
const { validateNewUser } = require('../validators/userValidators');
const {
  authorizeLogin,
  authorizeAdminLogin,
} = require('../controllers/authController');
const { createUserControl } = require('../controllers/usersController');
const { createAdminUserControl } = require('../controllers/adminController');

// POST /auth/register
authRouter.post('/register', validateNewUser, createUserControl);

// POST /auth/login
authRouter.post('/login', authorizeLogin);

// POST /auth/admin/register
authRouter.post('/admin/register', validateNewUser, createAdminUserControl);

// POST /auth/admin/login
authRouter.post('/admin/login', authorizeAdminLogin);

module.exports = authRouter;
