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
  const canvasRef = useRef(null);
  const ballsRef = useRef([]);
  const streakRef = useRef(null);
  const navbarRef = useRef(null);
  const footerRef = useRef(null);
  const mouse = useRef({ x: undefined, y: undefined });
  const rgb = [
    // Darker Pink shades
    "rgb(105, 0, 30)", // Darker Pink
    "rgb(184, 0, 76)", // Darker Deep Pink
    "rgb(139, 0, 44)", // Dark Raspberry
    "rgb(255, 20, 147)", // Deep Pink

    // Darker Purple shades
    "rgb(75, 0, 130)", // Darker Purple
    "rgb(55, 0, 100)", // Darker Indigo (a dark purple-blue)
    "rgb(48, 25, 52)", // Dark Eggplant
    "rgb(93, 33, 57)", // Dark Violet

    // Darker Blue shades
    "rgb(0, 0, 85)", // Darker Blue
    "rgb(0, 0, 139)", // Dark Blue
    "rgb(0, 0, 128)", // Navy Blue
    "rgb(0, 51, 102)", // Dark Steel Blue
    "rgb(0, 102, 204)", // Deep Sky Blue

    // Darker Cyan shades
    "rgb(0, 77, 77)", // Darker Cyan
    "rgb(0, 139, 139)", // Dark Cyan
    "rgb(0, 128, 128)", // Teal
    "rgb(0, 102, 102)", // Dark Sea Green

    // Adding more Darker shades of Pink, Purple, Blue, Cyan
    "rgb(94, 0, 32)", // Very Dark Pink
    "rgb(69, 0, 42)", // Dark Crimson
    "rgb(128, 0, 128)", // Purple (same as dark purple but more neutral)
    "rgb(38, 0, 77)", // Dark Magenta
    "rgb(0, 0, 205)", // Medium Dark Blue
    "rgb(0, 36, 68)", // Dark Slate Blue
    "rgb(0, 48, 58)", // Deep Dark Cyan
    "rgb(0, 83, 83)", // Dark Sea Green
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const str = streakRef.current;
    const ctx = canvas.getContext("2d");
    const navbar = navbarRef.current;
    const footer = footerRef.current;
    let w, h;

    function resizeReset() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function init() {
      resizeReset();
      animationLoop();
    }

    function animationLoop() {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "destination-over";
      if (!isMouseOverElement(navbar) && !isMouseOverElement(footer)) {
        drawBalls(ctx);
      }

      ballsRef.current = ballsRef.current.filter(
        (ball) => ball.time <= ball.ttl
      );

      requestAnimationFrame(animationLoop);
    }

    function drawBalls(ctx) {
      ballsRef.current.forEach((ball) => {
        ball.update();
        ball.draw(ctx);
      });
    }
    function mousemove(e) {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (!isMouseOverElement(navbar) && !isMouseOverElement(footer)) {
        Array.from({ length: 3 }).forEach(() =>
          ballsRef.current.push(new Ball(mouse.current))
        );
      }
    }

    function mouseout() {
      mouse.current.x = undefined;
      mouse.current.y = undefined;
    }

    function isMouseOverElement(element) {
      if (!element) return false;
      const rect = element.getBoundingClientRect();
      return (
        mouse.current.x >= rect.left - 20 &&
        mouse.current.x <= rect.right + 20 &&
        mouse.current.y >= rect.top - 20 &&
        mouse.current.y <= rect.bottom + 20
      );
    }

    function getRandomInt(min, max) {
      return Math.round(Math.random() * (max - min)) + min;
    }

    function easeOutQuart(x) {
      return 1 - Math.pow(1 - x, 4);
    }

    animationLoop();
    // Add event listeners
    window.addEventListener("mousemove", mousemove);
    window.addEventListener("mouseout", mouseout);
    window.addEventListener("resize", resizeReset);

    // Initialize animation
    init();

    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener("mousemove", mousemove);
      window.removeEventListener("mouseout", mouseout);
      window.removeEventListener("resize", resizeReset);
    };
  }, []);

  class Ball {
    constructor(mouse) {
      this.start = {
        x: mouse.x + Math.random() * 5 - 2.5,
        y: mouse.y + Math.random() * 5 - 2.5,
        size: Math.random() * 10 + 10,
      };
      this.end = {
        x: this.start.x + Math.random() * 600 - 300,
        y: this.start.y + Math.random() * 600 - 300,
      };
      this.x = this.start.x;
      this.y = this.start.y;
      this.size = this.start.size;
      this.style = rgb[Math.floor(Math.random() * rgb.length)];
      this.time = 0;
      this.ttl = 600;
    }
    draw(ctx) {
      ctx.fillStyle = this.style;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }
    update() {
      const progress = 1 - (this.ttl - this.time) / this.ttl;
      this.size = this.start.size * (1 - (1 - progress) ** 4);
      this.x = this.start.x;
      this.y = this.start.y;
      this.time++;
    }
  }

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
      <div className={styles.navbar} ref={navbarRef}>
        <Navbar></Navbar>
      </div>
      <div className="min-h-screen" style={{ marginLeft: "250px" }}>
        <canvas ref={canvasRef} className={styles.canvas} id="canvas" />
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
                <img src="/post.png"></img>
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
      <div ref={footerRef}>
        <Footer></Footer>
      </div>
    </div>
  );
};

export default Feed;
