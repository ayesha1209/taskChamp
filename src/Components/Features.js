import styles from "./Features.module.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import useTiltEffect from "./useTitleEffect";
import { useState, useEffect, useRef } from "react";
import { User } from "../models/User";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Task } from "../models/Task";

const Features = () => {
  const [user, setUser] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const ftRef1 = useTiltEffect();
  const ftRef2 = useTiltEffect();
  const ftRef3 = useTiltEffect();
  const ftRef4 = useTiltEffect();
  const ftRef5 = useTiltEffect();
  const ftRef6 = useTiltEffect();
  const penRef = useTiltEffect();
  const [taskNames, setTaskNames] = useState([]);
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
        mouse.current.x >= rect.left - 25 &&
        mouse.current.x <= rect.right + 25 &&
        mouse.current.y >= rect.top - 25 &&
        mouse.current.y <= rect.bottom + 25
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
      this.ttl = 500;
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
    const fetchDashboardTasks = async () => {
      const dateTask = new Date()
        .toLocaleDateString("en-GB")
        .replace(/\//g, "-");
      const userId = localStorage.getItem("userId");
      const pendingTaskNames = await fetchPendingTaskNames(userId, dateTask);
      console.log("Pending Task Names:", pendingTaskNames);
    };

    fetchDashboardTasks();
  }, []);
  const fetchPendingTaskNames = async (userId, dateTask) => {
    try {
      const user = await User.fetch(userId);
      console.log("Fetched User Data:", user);

      const allTasks = Object.keys(user.tasks).map((taskId) => {
        const taskData = user.tasks[taskId];
        return new Task(
          taskId,
          taskData.date,
          taskData.taskname,
          taskData.level,
          taskData.is_done,
          taskData.priority
        );
      });

      console.log("All Tasks:", allTasks);

      const pendingTasks = allTasks.filter((task) => !task.is_done);
      console.log("Pending Tasks:", pendingTasks);

      const todayTasks = pendingTasks.filter((task) => task.date === dateTask);
      console.log("Today's Tasks:", todayTasks);

      todayTasks.sort((a, b) => a.priority - b.priority);
      pendingTasks.sort((a, b) => {
        if (a.date === b.date) {
          return a.priority - b.priority;
        }
        return new Date(a.date) - new Date(b.date);
      });

      const finalTasks =
        todayTasks.length >= 5 ? todayTasks : pendingTasks.slice(0, 5);

      console.log("Final Tasks:", finalTasks);

      const taskNames = finalTasks.map((task) => task.taskname);
      setTaskNames(taskNames); // Update state
      return taskNames;
    } catch (error) {
      console.error("Error fetching pending task names:", error);
      return [];
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
    <div className={styles.feature_outer}>
      <div ref={navbarRef} className={styles.navbar}>
        <Navbar></Navbar>
      </div>
      <canvas ref={canvasRef} className={styles.canvas} id="canvas" />
      <div className={styles.featuresContainer}>
        <div className={styles.featureHeading}>
          <h1>Dashboard</h1>
          <h1>Dashboard</h1>
        </div>
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
            <h2 className={styles.userTask}>Hey {user.username} !</h2>
            <div className={styles.featurePara}>
              <p>
                Explore and manage your tasks, track progress, and stay
                motivated!
              </p>
            </div>
          </div>
        )}
        <div ref={penRef} className={styles.currentTaskOuter}>
          <div>
            <h3>Your Pending Tasks</h3>
            <div className={styles.currentCenter}>
              <img src="dash.png"></img>
            </div>
            {taskNames.length > 0 ? (
              <ul>
                {taskNames.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
            ) : (
              <p>No pending tasks available</p>
            )}
          </div>
        </div>
        <div className={styles.centerImage}>
          <img src="/dashboard.svg"></img>
        </div>
        <div className={styles.featureListOuter}>
          <div className={styles.featureList}>
            <h3 className={styles.featureListHead}>Tasky Features</h3>
            <div className={`${styles.featureItem}`}>
              <div ref={ftRef1}>
                <h3>
                  📅 <br />
                  Task Organization
                </h3>
                <p>
                  Effortlessly orchestrate your day, week, or month with our
                  task management system!
                </p>
              </div>
            </div>
            <div className={`${styles.featureItem}`}>
              <div ref={ftRef2}>
                <h3>
                  🔥 <br />
                  Streak Calendar
                </h3>
                <p>
                  Track your daily progress and stay motivated with streaks. Set
                  up reminders to never miss a task!
                </p>
              </div>
            </div>
            <div className={`${styles.featureItem}`}>
              <div ref={ftRef3}>
                <h3>
                  📢
                  <br /> Post / Feed
                </h3>
                <p>
                  Share your achievements and spread your progress with the
                  community through our feed!
                </p>
              </div>
            </div>
            <div className={`${styles.featureItem}`}>
              <div ref={ftRef4}>
                <h3>
                  🏆 <br />
                  Leaderboard
                </h3>
                <p>
                  Compare your daily progress with others, climb the ranks, and
                  earn medals to stay motivated!
                </p>
              </div>
            </div>
            <div className={`${styles.featureItem}`}>
              <div ref={ftRef5}>
                <h3>
                  📈 <br />
                  Graphical Insights
                </h3>
                <p>
                  Visualize your progress with insightful graphs and charts for
                  better tracking of your tasks!
                </p>
              </div>
            </div>
            <div className={`${styles.featureItem}`}>
              <div ref={ftRef6}>
                <h3>
                  💬
                  <br /> Chat Board
                </h3>
                <p>
                  Engage with other users through our interactive chat board and
                  share your progress!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Features;
