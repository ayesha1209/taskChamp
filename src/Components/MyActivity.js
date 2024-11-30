import { useEffect, useState, useRef } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import StreakCalendar from "./StreakCalendar";
import Navbar from "./Navbar";
import styles from "./MyActivity.module.css";
import Footer from "./Footer";
import { User } from "../models/User"; // Adjust import path as needed

const MyActivity = () => {
  const [user, setUser] = useState(null);
  const [imageUrl, setImageUrl] = useState(""); // State to hold the image URL
  const glowRef = useRef(null);
  const canvasRef = useRef(null);
  
  const streakRef = useRef(null);
  const navbarRef = useRef(null);
  const footerRef = useRef(null);
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");
      const fetchedUser = await User.fetch(userId);
      setUser(fetchedUser);

      if (fetchedUser.imageUrl) {
        // Fetch the download URL for the image
        const storage = getStorage();
        const storageRef = ref(storage, fetchedUser.imageUrl);
        try {
          const url = await getDownloadURL(storageRef);
          setImageUrl(url); // Set the image URL state
        } catch (error) {
          console.error("Error fetching image URL:", error);
        }
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <div className={styles.pageContainer_Outer} ref={glowRef}>
      <div className={styles.pageContainer}>
        <div className={styles.pageContainer_Inner}>
          <div className={styles.container}>
            <div className={styles.navbar} ref={navbarRef}>
              <Navbar />
            </div>
            
            <div className={styles.streak_outer}>
              <canvas ref={canvasRef} className={styles.canvas} id="canvas" />
              <div className={styles.streak} ref={streakRef}>
                {/* Add Heading above the image */}
                <div className={styles.headingContainer}>
                  <h2 className={styles.heading} class="text-3xl mt-8 font-extrabold leading-9 tracking-tight text-neutral-900 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">Keep up the good work!</h2>
                </div>

                {/* Adjust the image */}
                <img
                  src="/activitypage.jpg"
                  style={{ width: "350px", marginBottom: "-50px" }} // Negative margin to lift the image
                  alt="Activity"
                />

                <StreakCalendar />
              </div>
            </div>
          </div>
          <Footer className={styles.footer} ref={footerRef} />
        </div>
      </div>
    </div>
  );
};

export default MyActivity;
