// controllers/userController.js

const prisma = require('../config/prismaPool');
const { validationResult } = require('express-validator');

async function createUserControl(req, res, next) {
  const { username, firstname, lastname, email, websiteUrl, avatarUrl, pwd } =
    req.body;
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
        pwd: hashedPassword,
      },
    });
    res.status(200).json({ data: user });
  } catch (err) {
    console.error(err);
    next(err); // let Express handle error
  }
}

async function updateUserControl(req, res, next) {
  const { firstname, lastname, email, username, websiteUrl, avatarUrl, pwd } =
    req.body;
  const { userId } = req.params;
  const isAdmin = req.user.role;

  console.log('userId: ', userId);
  console.log('req.user.id :', req.user.id);

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
    if (pwd !== undefined) {
      const hashedPassword = await bcrypt.hash(pwd, 10);
      updateData.hashedPwd = hashedPassword;
    }

    if (req.user.id !== parseInt(userId) && isAdmin !== 'admin') {
      res.status(403).json({
        message:
          'Users can only be updated by the user or an admin. Request denied.',
      });
    }
    const user = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: updateData,
    });
    res.status(200).json({ data: user, message: 'User updated successfully.' });
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
        message:
          'Users can only be deleted by the user or an admin. Request denied.',
      });
    }
    const deleteUser = await prisma.user.delete({
      where: { id: parseInt(userId) },
    });
    res
      .status(200)
      .json({ data: deleteUser, message: 'Successfully deleted user.' });
  } catch (err) {
    console.error(err);
    if (err.code === 'P2025') {
      // Prisma error: record not found
      return res.status(404).json({ message: 'User not found.' });
    }
    next(err); // let Express handle error
  }
}

async function getAllUsersControl(req, res, next) {
  // protected by authenticateAdminToken middleware
  try {
    const users = await prisma.user.findMany();
    if (users) {
      res.status(200).json({ data: users });
    } else {
      res.status(400).json({ error: 'There are no users in the system.' });
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
      res.status(200).json({ data: user });
    } else {
      res.status(404).json({
        error: 'There is no user with that userId.',
        data: req.params,
      });
    }
  } catch (err) {
    console.error(err);
    if (err.code === 'P2025') {
      // Prisma error: record not found
      return res.status(404).json({ message: 'User not found.' });
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
