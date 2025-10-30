// controllers/postController.js

const prisma = require('../config/prismaPool');
const { validationResult } = require('express-validator');

async function createPostControl(req, res, next) {
  const { title, content, published, authorId } = req.body;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        data: req.body,
      });
    }
    const post = await prisma.post.create({
      data: {
        title,
        content,
        published,
        authorId,
      },
    });
    res.status(200).json({ data: post });
  } catch (err) {
    console.error(err);
    next(err); // let Express handle error
  }
}

// Get all posts and comments
async function getAllPostsControl(req, res, next) {
  try {
    const posts = await prisma.post.findMany({
      include: {
        comments: true,
      },
    });
    if (posts) {
      res.status(200).json({ data: posts });
    } else {
      res.status(404).json({ error: 'There are no posts in the system.' });
    }
  } catch (err) {
    console.error(err);
    next(err); // let Express handle error
  }
}

async function getPostControl(req, res, next) {
  try {
    const { postId } = req.params;
    const post = await prisma.post.findUnique({
      where: { id: parseInt(postId) },
      include: { comments: true },
    });
    if (post) {
      res.status(200).json({ data: post });
    } else {
      res.status(404).json({
        error: 'There is no post with that postId.',
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

async function updatePostControl(req, res, next) {
  const { title, content, published, authorId } = req.body;
  const { postId } = req.params;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        data: req.body,
      });
    }
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (published !== undefined) updateData.published = published;
    if (authorId !== undefined) updateData.authorId = authorId;

    const post = await prisma.post.update({
      where: { id: parseInt(postId) },
      data: updateData,
    });
    res.status(200).json({ data: post, message: 'Post updated successfully.' });
  } catch (err) {
    console.error(err);
    if (err.code === 'P2025') {
      // Prisma error: record not found
      return res.status(404).json({ message: 'Post not found.' });
    }
    next(err); // let Express handle error
  }
}

async function deletePostControl(req, res, next) {
  try {
    const { postId } = req.params;
    const deletePost = await prisma.post.delete({
      where: { id: parseInt(postId) },
    });
    res
      .status(200)
      .json({ data: deletePost, message: 'Successfully deleted post.' });
  } catch (err) {
    console.error(err);
    if (err.code === 'P2025') {
      // Prisma error: record not found
      return res.status(404).json({ message: 'Post not found.' });
    }
    next(err); // let Express handle error
  }
}

module.exports = {};
