const { Router } = require('express');
const authRouter = Router();
const { validateNewUser } = require('../validators/userValidators');
const { authorizeLogin } = require('../controllers/authController');
const { createUserControl } = require('../controllers/usersController');

// POST /auth/register
authRouter.post('/register', validateNewUser, createUserControl);

// POST /auth/login
authRouter.post('/login', authorizeLogin);

module.exports = authRouter;
