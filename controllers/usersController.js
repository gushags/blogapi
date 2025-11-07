// controllers/userController.js

const prisma = require('../config/prismaPool');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

async function createUserControl(req, res, next) {
  const {
    username,
    firstname,
    lastname,
    email,
    websiteUrl,
    avatarUrl,
    bio,
    pwd,
  } = req.body;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        data: req.body,
      });
    }
    const hashedPassword = await bcrypt.hash(pwd, 10);
    const user = await prisma.user.create({
      data: {
        username: username,
        firstname: firstname,
        lastname: lastname,
        email: email,
        avatarUrl: avatarUrl,
        websiteUrl: websiteUrl,
        bio: bio,
        hashedPwd: hashedPassword,
      },
    });
    const { hashedPwd, ...safeUser } = user; // Don't send pwd to client
    res.status(200).json({
      status: 'success',
      data: safeUser,
      message: 'User created successfully.',
    });
  } catch (err) {
    console.error(err);
    next(err); // let Express handle error
  }
}

async function updateUserControl(req, res, next) {
  const {
    firstname,
    lastname,
    email,
    username,
    websiteUrl,
    avatarUrl,
    bio,
    pwd,
    newPwd,
  } = req.body;
  const { userId } = req.params;
  const isAdmin = req.user.role;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        data: req.body,
      });
    }
    const updateData = {};
    if (firstname !== undefined) updateData.firstname = firstname;
    if (lastname !== undefined) updateData.lastname = lastname;
    if (email !== undefined) updateData.email = email;
    if (username !== undefined) updateData.username = username;
    if (websiteUrl !== undefined) updateData.websiteUrl = websiteUrl;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    if (bio !== undefined) updateData.bio = bio;
    if (pwd !== undefined && newPwd !== undefined) {
      const pwdCheckUser = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
      });
      const hashedPassword = await bcrypt.hash(pwd, 10);
      if (bcrypt.compare(pwdCheckUser.hashedPwd, hashedPassword)) {
        const newHashPwd = await bcrypt.hash(newPwd, 10);
        updateData.hashedPwd = newHashPwd;
      } else {
        return res.status(403).json({
          status: 'error',
          message:
            'Incorrect password. You must enter a correct password before you can change it. Request denied',
        });
      }
    }

    if (req.user.id !== parseInt(userId) && isAdmin !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message:
          'Users can only be updated by the user or an admin. Request denied.',
      });
    }
    const user = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: updateData,
    });
    const { hashedPwd, ...safeUser } = user;
    res.status(200).json({
      status: 'success',
      data: safeUser,
      message: 'User updated successfully.',
    });
  } catch (err) {
    console.error(err);
    if (err.code === 'P2025') {
      // Prisma error: record not found
      return res.status(404).json({ message: 'User not found.' });
    }
    next(err); // let Express handle error
  }
}

async function deleteUserControl(req, res, next) {
  const { userId } = req.params;
  const isAdmin = req.user.role;
  try {
    if (req.user.id !== parseInt(userId) && isAdmin !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message:
          'Users can only be deleted by the user or an admin. Request denied.',
      });
    }
    const deleteUser = await prisma.user.delete({
      where: { id: parseInt(userId) },
    });
    const { hashedPwd, ...safeDelete } = deleteUser;
    res.status(200).json({
      status: 'success',
      data: safeDelete, // Don't send password
      message: 'Successfully deleted user.',
    });
  } catch (err) {
    console.error(err);
    if (err.code === 'P2025') {
      // Prisma error: record not found
      return res
        .status(404)
        .json({ status: 'error', message: 'User not found.' });
    }
    next(err); // let Express handle error
  }
}

async function getAllUsersControl(req, res, next) {
  // protected by authenticateAdminToken middleware
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        firstname: true,
        lastname: true,
        avatarUrl: true,
        websiteUrl: true,
        bio: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (users) {
      res.status(200).json({
        status: 'success',
        data: users,
        message: 'All users successfully found.',
      });
    } else {
      res.status(400).json({
        status: 'error',
        error: 'There are no users in the system.',
      });
    }
  } catch (err) {
    console.error(err);
    next(err); // let Express handle error
  }
}

async function getUserControl(req, res, next) {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });
    if (user) {
      const { hashedPwd, ...safeUser } = user;
      res.status(200).json({
        status: 'success',
        data: safeUser,
        message: 'User successfully found.',
      });
    } else {
      res.status(404).json({
        status: 'error',
        data: req.params,
        message: 'There is no user with that userId.',
      });
    }
  } catch (err) {
    console.error(err);
    if (err.code === 'P2025') {
      // Prisma error: record not found
      return res
        .status(404)
        .json({ status: 'error', message: 'User not found.' });
    }
    next(err); // let Express handle error
  }
}

module.exports = {
  createUserControl,
  updateUserControl,
  deleteUserControl,
  getAllUsersControl,
  getUserControl,
};
