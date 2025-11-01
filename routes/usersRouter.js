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

/**
 *  ----- USERS ROUTES -----
 */

// Get all users
usersRouter.get('/', authenticateAdminToken, getAllUsersControl);

// Get one user
usersRouter.get('/:userId', authenticateToken, getUserControl);

// Update a user
usersRouter.put(
  '/:userId',
  validateUpdateUser,
  authenticateToken,
  updateUserControl
);

// Delete a user
usersRouter.delete('/:userId', authenticateToken, deleteUserControl);

module.exports = usersRouter;
