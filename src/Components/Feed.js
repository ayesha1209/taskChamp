import React, { useState, useEffect } from 'react';
import { realDb } from '../firebase';
import { ref, onValue, query, orderByChild } from 'firebase/database';
import AddPost from './AddPost';
import PostList from './PostList';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const mockUser = { uid: 'user_1729113758001', displayName: 'vrunda38' };

  useEffect(() => {
    const postsRef = ref(realDb, 'posts');
    const postsQuery = query(postsRef, orderByChild('createdAt'));

    const unsubscribe = onValue(postsQuery, (snapshot) => {
      const postsData = snapshot.val();
      const postsArray = postsData ? Object.entries(postsData).map(([id, post]) => ({
        id,
        ...post
      })).reverse() : [];
      setPosts(postsArray);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="feed">
      <PostList posts={posts} user={mockUser} />
      <AddPost user={mockUser} />
    </div>
  );
};

export default Feed;
