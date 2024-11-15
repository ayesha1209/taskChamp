import styles from "./Features.module.css"; // CSS for styling
import Navbar from "./Navbar";
import Footer from "./Footer";
import useTiltEffect from "./useTitleEffect";
import { useState, useEffect, useRef } from "react";
import { User } from "../models/User"; // Adjust import path as needed
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

  useEffect(() => {
    const fetchDashboardTasks = async () => {
      const dateTask = new Date()
        .toLocaleDateString("en-GB")
        .replace(/\//g, "-");
      const userId = localStorage.getItem("userId");
      const pendingTaskNames = await fetchPendingTaskNames(userId, dateTask);
      console.log("Pending Task Names:", pendingTaskNames);
      // Use the task names in your dashboard logic
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
      <Navbar></Navbar>
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
