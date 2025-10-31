// routes/usersRouter.js
const { Router } = require('express');
const usersRouter = Router();
const { validateUpdateUser } = require('../validators/userValidators');
const {
  authenticateToken,
  authenticateAdminToken,
} = require('../validators/authValidator');

const {
  getUserControl,
  getAllUsersControl,
  deleteUserControl,
  updateUserControl,
} = require('../controllers/usersController');

// Get all users
// should be admin to get
usersRouter.get('/', authenticateAdminToken, getAllUsersControl);

// Get one user
// should be logged in == userId to see anything beyond username, avatar and website
usersRouter.get('/:userId', getUserControl);

// Update a user
// Should be loggedin user to get
usersRouter.put('/:userId', validateUpdateUser, updateUserControl);

// Delete a user
// Should be logged in user
usersRouter.delete('/:userId', deleteUserControl);

module.exports = usersRouter;
