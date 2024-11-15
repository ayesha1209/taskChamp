import React from "react";
import styles from "./Features.module.css"; // CSS for styling
import Navbar from "./Navbar";
import Footer from "./Footer";

const Features = () => {
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
        <div className={styles.featureListOuter}>
          <div className={styles.featureList}>
            <h3 className={styles.featureListHead}>Tasky Features</h3>
            <div className={`${styles.featureItem}`}>
              <div>
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
              <div>
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
              <div>
                <h3>
                  📢
                  <br /> Post/Feed
                </h3>
                <p>
                  Share your achievements and spread your progress with the
                  community through our interactive feed!
                </p>
              </div>
            </div>
            <div className={`${styles.featureItem}`}>
              <div>
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
              <div>
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
              <div>
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
