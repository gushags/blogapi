// controllers/postController.js

const prisma = require('../config/prismaPool');
const { validationResult } = require('express-validator');
const { buildCommentTree } = require('./utils/util');

async function createCommentControl(req, res, next) {
  const { content, published, ownerId, parentId, postId } = req.body;
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
        published: Boolean(published),
        ownerId: parseInt(ownerId),
        parentId: parseInt(parentId),
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

async function updateCommentControl(req, res, next) {
  const { content, published, ownerId, parentId } = req.body;
  const { postId, commentId } = req.params;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        data: req.body,
      });
    }
    const updateData = {};
    if (content !== undefined) updateData.content = content;
    if (published !== undefined) updateData.published = published;
    if (ownerId !== undefined) updateData.ownerId = ownerId;
    if (parentId !== undefined) updateData.parentId = parentId;
    if (postId !== undefined) updateData.postId = postId;

    const comment = await prisma.comment.update({
      where: { id: parseInt(commentId) },
      data: updateData,
    });
    res
      .status(200)
      .json({ data: comment, message: 'Comment updated successfully.' });
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
  try {
    const { commentId } = req.params;
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
};
