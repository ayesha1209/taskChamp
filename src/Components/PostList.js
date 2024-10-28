// PostList.js
import React from 'react';
import Post from './Post';

const PostList = ({ posts, user }) => {
  return (
    <div className="max-w-2xl mx-auto px-4">
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <div className="text-gray-400 text-lg">No posts yet</div>
          <p className="text-gray-500 mt-2">Be the first to share something!</p>
        </div>
      ) : (
        posts.map(post => (
          <Post key={post.id} post={post} user={user} />
        ))
      )}
    </div>
  );
};


export default PostList;
