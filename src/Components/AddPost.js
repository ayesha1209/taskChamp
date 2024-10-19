
// components/AddPost.js
import React, { useState } from 'react';
import { realDb } from '../firebase';
import { ref, push, serverTimestamp } from 'firebase/database';

const AddPost = ({ user }) => {
  const [newPost, setNewPost] = useState('');

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const postsRef = ref(realDb, 'posts');
    await push(postsRef, {
      content: newPost,
      userId: user.uid,
      username: user.displayName,
      createdAt: serverTimestamp(),
      likes: {},
      comments: {}
    });

    setNewPost('');
  };

  return (
    <form onSubmit={handlePostSubmit}>
      <textarea
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
        placeholder="What's happening?"
      />
      <button type="submit">Post</button>
    </form>
  );
};

export default AddPost;