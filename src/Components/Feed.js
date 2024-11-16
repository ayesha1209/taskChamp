import React, { useState, useEffect, useRef } from "react";
import { realDb } from "../firebase";
import { ref, onValue, query, orderByChild, get } from "firebase/database";
import AddPost from "./AddPost";
import PostList from "./PostList";
import styles from "./Feed.module.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import useTitleEffect from "./useTitleEffect";
import { User } from "../models/User";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";

const motivationalQuotes = [
  "Every moment is a fresh beginning.",
  "The best time to start was yesterday. The next best time is now.",
  "Your potential is limitless.",
  "Small steps lead to big changes.",
];

const Feed = () => {
  const [user, setUser] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [quote, setQuote] = useState("");
  const [topStreaks, setTopStreaks] = useState([]);
  const userId = localStorage.getItem("userId");
  const cardRef = useTitleEffect();
  const card_top_ref = useTitleEffect();

  const fetchUsername = async (userId) => {
    try {
      const userRef = ref(realDb, `users/${userId}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        return userData.username;
      }
      return null;
    } catch (error) {
      console.error("Error fetching username:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");
      const fetchedUser = await User.fetch(userId);
      setUser(fetchedUser);

      if (fetchedUser.imageUrl) {
        // Fetch the download URL for the image
        const storage = getStorage();
        const storRef = storageRef(storage, fetchedUser.imageUrl);
        try {
          const url = await getDownloadURL(storRef);
          setImageUrl(url); // Set the image URL state
        } catch (error) {
          console.error("Error fetching image URL:", error);
        }
      }
    };

    fetchUserDetails();
  }, []);

  const fetchTopStreaks = async () => {
    const streaksRef = ref(realDb, "users");
    const snapshot = await get(streaksRef);
    if (snapshot.exists()) {
      const users = snapshot.val();
      const streakData = Object.entries(users)
        .map(([id, user]) => ({
          username: user.username,
          streak: user.streak?.[0] || "0",
        }))
        .sort((a, b) => parseInt(b.streak) - parseInt(a.streak))
        .slice(0, 5);
      setTopStreaks(streakData);
    }
  };

  useEffect(() => {
    const randomQuote =
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setQuote(randomQuote);

    if (userId) {
      fetchUsername(userId).then((fetchedUsername) => {
        if (fetchedUsername) {
          setUsername(fetchedUsername);
        }
      });
    }

    fetchTopStreaks();

    const postsRef = ref(realDb, "posts");
    const postsQuery = query(postsRef, orderByChild("createdAt"));

    const unsubscribe = onValue(postsQuery, (snapshot) => {
      const postsData = snapshot.val();
      const postsArray = postsData
        ? Object.entries(postsData)
            .map(([id, post]) => ({
              id,
              ...post,
            }))
            .sort(
              (a, b) =>
                Object.keys(b.likes || {}).length -
                Object.keys(a.likes || {}).length
            )
        : [];
      setPosts(postsArray);
    });

    return () => unsubscribe();
  }, [userId]);

  return (
    <div className={styles.feed_outer}>
      <Navbar></Navbar>
      <div className="min-h-screen" style={{ marginLeft: "250px" }}>
        {/* Quote Header */}

        {/* <div className={`text-white ${styles.quote_outer}`}>
          <div className={`max-w-6xl py-4 mx-auto px-4 ${styles.quote_inner}`}>
            <p className="text-xl italic font-semibold font-light text-center">
              {quote}
            </p>
          </div>
        </div> */}

        {/* Main Content */}
        <div className={`max-w-6xl mx-auto px-20 py-8 ${styles.feed_inner}`}>
          <div className={styles.communityHead}>
            <h1>Community Hub</h1>
            <h1>Community Hub</h1>
          </div>
          {user && (
            <div className={styles.userGreeting}>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Profile"
                  className={styles.profileImage}
                />
              )}
              <h2 className={styles.userTask}>{user.username} Here !</h2>
              <div className={styles.featurePara}>
                <p>{quote}</p>
              </div>
            </div>
          )}
          <div className={styles.hubIntro}>
            <h3 className={styles.welcomeHead}>
              Welcome to the Community Hub!
            </h3>
            <div className={styles.centerImage}>
              <img src="/feed.svg"></img>
            </div>
            <p>Connect, collaborate, and share tips with fellow Tasky users.</p>
            <p> Together, let’s simplify task management and achieve more!</p>
          </div>
          <br></br>
          {userId && username ? (
            <div className="flex gap-14">
              {/* Left Column - Posts */}

              <div>
                {/* Add Post Section */}
                <div
                  ref={cardRef}
                  className={`bg-white shadow-sm ${styles.post_form_outer}`}
                >
                  <div className={`${styles.post_form_inner}`}>
                    <AddPost />
                  </div>
                </div>
              </div>
              {/* Right Column - Add Post & Streaks */}
              {/* Top Streaks Section */}
              <div ref={card_top_ref} className={`${styles.top_streak_outer}`}>
                <div className={styles.top_streak_inner}>
                  <h3 className="text-2xl font-semibold mb-4 ml-2 text-white inline-flex items-center">
                    Top Streaks
                    <img
                      src="fire.svg"
                      className="h-8 w-8 ml-2"
                      alt="fire icon"
                    />
                  </h3>

                  <div className="space-y-3">
                    {topStreaks.map((user, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg ${styles.top_li}`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={styles.flip_card}>
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-400">
                            {user.username}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-white font-semibold">
                            {user.streak}
                          </span>
                          <span className="text-orange-500">
                            <img src="fire2.svg" className="h-5 w-5 ml-1"></img>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`text-center py-56 ${styles.feed_inner_load}`}>
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading your Feed...</p>
            </div>
          )}

          <div className={`flex-grow ${styles.postListOuter}`}>
            <div>
              <h2 className="text-4xl font-bold mb-6 text-white">
                Dive into the Feed!
              </h2>
              <div className={styles.centerImage}>
                <img src="/postlist.svg"></img>
              </div>
              <p className={styles.postListPara}>
                Our keeps you updated with posts from the community and trends.
              </p>
              <p className={styles.postListPara}>
                Interact through likes, comments, and shares to stay engaged and
                inspired!
              </p>
              <PostList
                posts={posts}
                user={{ uid: userId, displayName: username }}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Feed;
