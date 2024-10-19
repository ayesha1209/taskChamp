import React, { useState } from 'react';
import { realDb } from '../firebase';
import { ref, update, push, serverTimestamp } from 'firebase/database';

const Post = ({ post, user }) => {
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    const postRef = ref(realDb, `posts/${post.id}`);
    const updates = {};
    
    if (post.likes && post.likes[user.uid]) {
      updates[`likes/${user.uid}`] = null;
    } else {
      updates[`likes/${user.uid}`] = true;
    }

    await update(postRef, updates);
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;

    const commentsRef = ref(realDb, `posts/${post.id}/comments`);
    await push(commentsRef, {
      content: newComment,
      userId: user.uid,
      username: user.displayName,
      createdAt: serverTimestamp()
    });

    setNewComment('');
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    const date = new Date(timestamp);
    return date.toLocaleString(); // This will format the date according to the user's locale
  };

  const likesCount = post.likes ? Object.keys(post.likes).length : 0;
  const comments = post.comments ? Object.values(post.comments) : [];

  return (
    <div className="post">
      <p><strong>{post.username}</strong> - <small>{formatTimestamp(post.createdAt)}</small></p>
      <p>{post.content}</p>
      <button className="like-button" onClick={handleLike}>
        Like ({likesCount})
      </button>
      <button className="comment-toggle" onClick={() => setShowComments(!showComments)}>
        {showComments ? 'Hide Comments' : 'Show Comments'}
      </button>
      {showComments && (
        <div className="comments">
          <h4>Comments:</h4>
          {comments.map((comment, index) => (
            <p key={index}>
              <strong>{comment.username}:</strong> {comment.content}
              <br />
              <small>{formatTimestamp(comment.createdAt)}</small>
            </p>
          ))}
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
          />
          <button onClick={handleComment}>Comment</button>
        </div>
      )}
    </div>
  );
};

export default Post;
