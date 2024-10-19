import React from 'react';
import Post from './Post';

const PostList = ({ posts, user }) => {
  return (
    <div className="post-list">
      {posts.map(post => (
        <Post key={post.id} post={post} user={user} />
      ))}
    </div>
  );
};

export default PostList;
