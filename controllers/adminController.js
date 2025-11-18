// controllers/adminController.js

const prisma = require('../config/prismaPool');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

async function createAdminUserControl(req, res, next) {
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
        isAdmin: true,
        isAuthor: true,
      },
    });
    const { hashedPwd, ...safeUser } = user; // Don't send pwd to client
    res.status(200).json({
      status: 'success',
      data: safeUser,
      message: 'Admin User created successfully.',
    });
  } catch (err) {
    console.error(err);
    next(err); // let Express handle error
  }
}

module.exports = { createAdminUserControl };
