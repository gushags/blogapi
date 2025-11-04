// controllers/postController.js

const prisma = require('../config/prismaPool');
const { validationResult } = require('express-validator');
const { buildCommentTree } = require('./utils/util');

async function createCommentControl(req, res, next) {
  const { content, published, parentId, postId } = req.body;
  const pubTrueOrFalse = published === 'true'; // converts published string to boolean
  const ownerId = req.user.id;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        data: req.body,
      });
    }
    const comment = await prisma.comment.create({
      data: {
        content: content,
        published: pubTrueOrFalse,
        ownerId: ownerId,
        parentId: parseInt(parentId) || null,
        postId: parseInt(postId),
      },
    });
    res
      .status(200)
      .json({ data: comment, message: 'Comment created successfully' });
  } catch (err) {
    console.error(err);
    next(err); // let Express handle error
  }
}

async function getCommentsControl(req, res, next) {
  const { postId } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: parseInt(postId) },
      include: {
        owner: {
          select: { id: true, username: true, email: true, avatarUrl: true },
        },
      },
    });

    const commentsTree = buildCommentTree(comments);

    res.status(200).json({
      data: commentsTree,
      message: 'Comments retrieved successfully',
    });
  } catch (err) {
    console.error(err);
    next(err); // let Express handle error
  }
}

async function getSingleCommentControl(req, res, next) {
  const { postId, commentId } = req.params;
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
      include: {
        post: { select: { id: true } },
      },
    });

    // Handle if not found
    if (!comment) {
      return res
        .status(404)
        .json({ message: 'Comment not found', data: req.params });
    }

    // Make sure the route is respected (/posts/:postId/comments/:commentId)
    if (comment.post.id !== parseInt(postId)) {
      return res.status(400).json({
        message: `Comment ${commentId} does not belong to post ${postId}`,
      });
    }

    // -- Success --
    res
      .status(200)
      .json({ data: comment, message: 'Comment retrieved successfully' });
  } catch (err) {
    console.error(err);
    if (err.code === 'P2025') {
      // Prisma error: record not found
      return res.status(404).json({ message: 'User not found.' });
    }
    next(err); // let Express handle error
  }
}

async function updateCommentControl(req, res, next) {
  const { content, published } = req.body;
  const { postId, commentId } = req.params;
  const ownerId = req.user.id;
  const isAdmin = req.user.role;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        data: req.body,
      });
    }
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
    });

    if (comment.postId !== parseInt(postId)) {
      return res.status(400).json({
        message: `Comment ${commentId} does not belong to post ${postId} and cannot be updated.`,
      });
    }
    if (comment.ownerId !== ownerId && isAdmin !== 'admin') {
      return res.status(400).json({
        message:
          'Comments can only be updated by their owner or an admin. Request denied.',
      });
    }

    const updateData = {};
    if (content !== undefined) updateData.content = content;
    if (published !== undefined) updateData.published = published;

    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(commentId) },
      data: updateData,
    });
    res
      .status(200)
      .json({ data: updatedComment, message: 'Comment updated successfully.' });
  } catch (err) {
    console.error(err);
    if (err.code === 'P2025') {
      // Prisma error: record not found
      return res.status(404).json({ message: 'Comment not found.' });
    }
    next(err); // let Express handle error
  }
}

async function deleteCommentControl(req, res, next) {
  const { commentId } = req.params;
  const ownerId = req.user.id;
  const isAdmin = req.user.role;
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
    });

    if (!comment) {
      res.status(404).json({ message: 'Comment not found.' });
    }

    if (comment.ownerId !== ownerId && isAdmin !== 'admin') {
      res.status(403).json({
        message:
          'Comments can only be deleted by their author or an admin. Request denied.',
      });
    }
    const deleteComment = await prisma.comment.delete({
      where: { id: parseInt(commentId) },
    });
    res
      .status(200)
      .json({ data: deleteComment, message: 'Successfully deleted comment.' });
  } catch (err) {
    console.error(err);
    next(err); // let Express handle error
  }
}

module.exports = {
  createCommentControl,
  deleteCommentControl,
  updateCommentControl,
  getCommentsControl,
  getSingleCommentControl,
};
