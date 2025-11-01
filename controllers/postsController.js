// controllers/postController.js

const prisma = require('../config/prismaPool');
const { validationResult } = require('express-validator');
const { buildCommentTree } = require('./utils/util');

async function createPostControl(req, res, next) {
  const { title, content, published } = req.body;
  const authorId = req.user.id;

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
        title: title,
        content: content,
        published: Boolean(published),
        authorId: authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            email: true,
            avatarUrl: true,
            websiteUrl: true,
          },
        },
      },
    });
    res.status(200).json({ data: post });
  } catch (err) {
    console.error(err);
    next(err); // let Express handle error
  }
}

// Get all posts and comments
async function getPostsControl(req, res, next) {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            avatarUrl: true,
            websiteUrl: true,
            email: true,
          },
        },
        comments: {
          include: {
            owner: {
              select: { id: true, username: true, avatarUrl: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Build nested comment tree for each post
    const postsWithComments = posts.map((post) => ({
      ...post,
      comments: buildCommentTree(post.comments),
    }));

    res.status(200).json({
      data: postsWithComments,
      message: 'Posts retrieved successfully.',
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
}

async function getPostControl(req, res, next) {
  const { postId } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(postId) },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            avatarUrl: true,
            websiteUrl: true,
            email: true,
          },
        },
        comments: {
          include: {
            owner: {
              select: {
                id: true,
                username: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    const postWithComments = {
      ...post,
      comments: buildCommentTree(post.comments),
    };

    if (post) {
      res.status(200).json({
        data: postWithComments,
        message: 'Post retrieved successfully',
      });
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
  const { title, content, published } = req.body;
  const { postId } = req.params;
  const authorId = req.user.id;
  const isAdmin = req.user.role;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        data: req.body,
      });
    }

    const post = await prisma.post.findUnique({
      where: { id: parseInt(postId) },
    });

    if (!post) {
      res.status(404).json({ message: 'Post not found.' });
    }

    if (post.authorId !== authorId && isAdmin !== 'admin') {
      res.status(403).json({
        message:
          'Posts can only be updated by their author or an admin. Request denied.',
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (published !== undefined) updateData.published = published;

    await prisma.post.update({
      where: { id: parseInt(postId) },
      data: updateData,
    });

    const updatedPost = await prisma.post.findUnique({
      where: { id: parseInt(postId) },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            avatarUrl: true,
            websiteUrl: true,
            email: true,
          },
        },
        comments: {
          include: {
            owner: {
              select: {
                id: true,
                username: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    const updatedPostWithComments = {
      ...updatedPost,
      comments: buildCommentTree(updatedPost.comments),
    };

    res.status(200).json({
      data: updatedPostWithComments,
      message: 'Post updated successfully.',
    });
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
  const { postId } = req.params;
  const authorId = req.user.id;
  const isAdmin = req.user.role;
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(postId) },
    });

    if (!post) {
      res.status(404).json({ message: 'Post not found.' });
    }

    if (post.authorId !== authorId && isAdmin !== 'admin') {
      res.status(403).json({
        message: 'Posts can only be deleted by their author or an admin.',
      });
    }
    const deletePost = await prisma.post.delete({
      where: { id: parseInt(postId) },
    });
    res
      .status(200)
      .json({ data: deletePost, message: 'Successfully deleted post.' });
  } catch (err) {
    console.error(err);
    next(err); // let Express handle error
  }
}

module.exports = {
  createPostControl,
  getPostsControl,
  getPostControl,
  updatePostControl,
  deletePostControl,
};
