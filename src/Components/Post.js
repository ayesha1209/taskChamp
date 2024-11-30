// Post.js
import React, { useState } from "react";
import { realDb } from "../firebase";
import { ref, update, push, serverTimestamp } from "firebase/database";
import styles from "./Post.module.css";

const Post = ({ post, user }) => {
  const [newComment, setNewComment] = useState("");
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
      createdAt: serverTimestamp(),
    });

    setNewComment("");
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown time";
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const likesCount = post.likes ? Object.keys(post.likes).length : 0;
  const comments = post.comments ? Object.values(post.comments) : [];

  return (
    <div className={styles.post_outer}>
      <div
        className={`rounded-xl shadow-sm py-3 px-7 mb-6 hover:shadow-md transition-shadow duration-200 ${styles.post_inner}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={styles.flip_card}>
              {post.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-300">{post.username}</h3>
              <p className="text-sm text-gray-400">
                {formatTimestamp(post.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <p className="text-white mb-4 text-xl font-semibold">{post.content}</p>

        <div className="flex items-center space-x-6 mb-1">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${
              post.likes && post.likes[user.uid]
                ? styles.liked_post
                : styles.not_liked_post
            } hover:bg-blue-100 hover:text-blue-600 transition duration-200`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            <span>{likesCount}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition duration-200  ${styles.not_liked_post}`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
            <span>{comments.length}</span>
          </button>
        </div>

        {showComments && (
          <div className="space-y-4 pt-4 mt-4 border-t border-gray-100">
            {comments.map((comment, index) => (
              <div
                key={index}
                className={`bg-gray-50 rounded-lg px-4 py-2.5 ${styles.comment_div}`}
              >
                <div className="flex items-center justify-between mb-0">
                  <div className="flex items-center space-x-2">
                    <div className={styles.flip_card_comment}>
                      {comment.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-md text-gray-300">
                      {comment.username}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {formatTimestamp(comment.createdAt)}
                  </span>
                </div>
                <p className="text-white font-semibold text-lg ml-10">
                  {comment.content}
                </p>
              </div>
            ))}

            <div className="flex space-x-2">
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className={`flex-1 px-4 py-1.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${styles.comment_input}`}
              />
              <button
                onClick={handleComment}
                className={`px-2.5 py-1.5 text-white rounded-lg transition duration-200 ${styles.comment_btn}`}
              >
                Comment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
