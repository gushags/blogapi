// controllers/postController.js

const prisma = require('../config/prismaPool');
const { validationResult } = require('express-validator');

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

module.exports = { createCommentControl, deleteCommentControl };
