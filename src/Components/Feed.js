import React, { useState, useEffect, useRef } from "react";
import { realDb } from "../firebase";
import { ref, onValue, query, orderByChild, get } from "firebase/database";
import AddPost from "./AddPost";
import PostList from "./PostList";
import styles from "./Feed.module.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const motivationalQuotes = [
  "Every moment is a fresh beginning.",
  "The best time to start was yesterday. The next best time is now.",
  "Your potential is limitless.",
  "Small steps lead to big changes.",
];

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [quote, setQuote] = useState("");
  const [topStreaks, setTopStreaks] = useState([]);
  const userId = localStorage.getItem("userId");
  const cardRef = useRef(null);
  const card_top_ref = useRef(null);

  useEffect(() => {
    const card = cardRef.current;

    const handleMouseMove = (e) => {
      const { width, height, left, top } = card.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;

      const rotateX = (y / height - 0.5) * 20;
      const rotateY = (x / width - 0.5) * -20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
    };

    if (card) {
      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (card) {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  useEffect(() => {
    const card_top = card_top_ref.current;
    const handleMouseMove = (e) => {
      const { width, height, left, top } = card_top.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;

      const rotateX = (y / height - 0.5) * 20;
      const rotateY = (x / width - 0.5) * -20;

      card_top.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      card_top.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
    };

    if (card_top) {
      card_top.addEventListener("mousemove", handleMouseMove);
      card_top.addEventListener("mouseleave", handleMouseLeave);
    }

    // return () => {
    //   if (card_top) {
    //     card_top.removeEventListener("mousemove", handleMouseMove);
    //     card_top.removeEventListener("mouseleave", handleMouseLeave);
    //   }
    // };
  }, []);

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
        <div className={`text-white ${styles.quote_outer}`}>
          <div className={`max-w-6xl py-4 mx-auto px-4 ${styles.quote_inner}`}>
            <p className="text-xl italic font-semibold font-light text-center">
              {quote}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className={`max-w-6xl mx-auto px-12 py-8 ${styles.feed_inner}`}>
          {userId && username ? (
            <div className="flex gap-8">
              {/* Left Column - Posts */}
              <div className={`flex-grow max-w-3xl`}>
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-800"></h2>
                  <PostList
                    posts={posts}
                    user={{ uid: userId, displayName: username }}
                  />
                </div>
              </div>

              {/* Right Column - Add Post & Streaks */}
              <div className="w-80 space-y-6">
                {/* Add Post Section */}
                <div
                  ref={cardRef}
                  className={`bg-white rounded-xl shadow-sm ${styles.post_form_outer}`}
                >
                  <div className={`${styles.post_form_inner} rounded-xl`}>
                    <AddPost />
                  </div>
                </div>

                {/* Top Streaks Section */}
                <div
                  ref={card_top_ref}
                  className={`${styles.top_streak_outer}`}
                >
                  <div className={styles.top_streak_inner}>
                    <h3 className="text-3xl font-semibold mb-4 ml-2 text-white inline-flex items-center">
                      Top Streaks{" "}
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
                              <img
                                src="fire2.svg"
                                className="h-5 w-5 ml-1"
                              ></img>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`text-center py-56 ${styles.feed_inner_load}`}>
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading your feed...</p>
            </div>
          )}
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Feed;
