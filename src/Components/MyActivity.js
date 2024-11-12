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
        mouse.current.x >= rect.left &&
        mouse.current.x <= rect.right &&
        mouse.current.y >= rect.top &&
        mouse.current.y <= rect.bottom
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
        size: Math.random() * 10 + 5,
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
      this.ttl = 450;
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
                <h1 className={styles.heading}>My Activity</h1>
                <h1 className={styles.heading}>My Activity</h1>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                {user && (
                  <div className={styles.userGreeting}>
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt="Profile"
                        className={styles.profileImage}
                      />
                    )}
                    <h2 className={styles.userTask}>{user.username}'s Task</h2>
                  </div>
                )}
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
