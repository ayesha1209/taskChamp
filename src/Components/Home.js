import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import styles from "./Home.module.css";

const Home = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className={styles.homeContainer}>
      <header className={styles.header}>
        <h1>
          Welcome back, <span className={styles.userName}>{username}</span>!
        </h1>
        <p>
          Every task you complete is a step closer to your dreams—let's make
          today legendary! 🌟✅
        </p>
      </header>

      <div className={styles.contentContainer}>
        <div className={styles.mainContent}>
          <h2>Today's Highlights</h2>
          <p>Check out your most recent tasks and progress below!</p>
        </div>

        {/* <Sidebar /> */}
      </div>

      {/* Footer Section */}
      {/* <footer className={styles.footer}>
        <p>© 2024 TaskChamp. All rights reserved.</p>
      </footer> */}
    </div>
  );
};

export default Home;
