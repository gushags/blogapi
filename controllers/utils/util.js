// controllers/util.js

// Helper function to build comments with replies
function buildCommentTree(comments) {
  const map = new Map();
  comments.forEach((comment) =>
    map.set(comment.id, { ...comment, replies: [] })
  );

  const roots = [];
  comments.forEach((comment) => {
    if (comment.parentId) {
      const parent = map.get(comment.parentId);
      if (parent) parent.replies.push(map.get(comment.id));
    } else {
      roots.push(map.get(comment.id));
    }
  });

  return roots;
}

module.exports = { buildCommentTree };
