// routes/usersRouter.js
const { Router } = require('express');
const usersRouter = Router();
const {
  validateNewUser,
  validateUpdateUser,
} = require('../validators/userValidators');

const {
  createUserControl,
  getUserControl,
  getAllUsersControl,
  deleteUserControl,
  updateUserControl,
} = require('../controllers/usersController');

// Get all users
usersRouter.get('/', getAllUsersControl);

// Get one user
usersRouter.get('/:userId', getUserControl);

// Create a user
usersRouter.post('/', validateNewUser, createUserControl);

// Update a user
usersRouter.put('/:userId', validateUpdateUser, updateUserControl);

// Delete a user
usersRouter.delete('/:userId', deleteUserControl);

module.exports = usersRouter;
