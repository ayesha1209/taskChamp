import React from "react";
import styles from "./AboutUs.module.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

// Import each image with a unique name
// import kp from "../assets/images/kp.jpg";
// import AP from "../assets/images/AP.jpg";
// import VR from "../assets/images/VR.jpg";
// import MV from "../assets/images/MV.jpg";

const AboutUs = () => {
  return (
    <div className={styles["about_us_container"]}>
      <Navbar></Navbar>
      <div className={styles.about_inner}>
        <section className={styles.about_header}>
          <h1>What is Tasky ?!</h1>
          <h1>What is Tasky ?!</h1>
          <p>Discover who we are and what we stand for !</p>
        </section>
        <section className={styles.mission}>
          <div className={styles.mission_inner}>
            <h2>Our Mission</h2>
            <p>
              Our mission at Tasky is to create a seamless, user-friendly
              platform that empowers you to manage your schedule with ease. We
              believe productivity should be fun and empowering, not
              overwhelming! With Tasky, handling your daily tasks—both personal
              and professional—is simple, efficient, and a little bit funky.
              Let’s make time management work for you, the fun way!
            </p>
          </div>
        </section>

        <section className={styles.vision}>
          <div className={styles.vision_inner}>
            <h2>Our Vision</h2>
            <p>
              We envision Tasky as the go-to solution for productivity
              enthusiasts, students, professionals, and anyone seeking a
              structured approach to managing their to-do lists. Our aim is to
              create a tool that not only organizes tasks but also inspires
              users to set and achieve their goals, one step at a time.
            </p>
          </div>
        </section>
        <div className={styles.centeredImage}>
          <img src="/about.svg"></img>
        </div>
        <section className={styles.team}>
          <div className={styles.team_inner}>
            <h2>Meet Our Team</h2>
            <div className={styles["team_members"]}>
              <div className={styles["member_card"]}>
                <div
                  className={styles["member_photo"]}
                  style={{ backgroundImage: `url(/AP.jpg)` }}
                  // style={{ backgroundImage: `url(${AP})` }}
                ></div>
                <h3>Ayesha Patel</h3>
                <p>Developer</p>
              </div>
              <div className={styles["member_card"]}>
                <div
                  className={styles["member_photo"]}
                  style={{ backgroundImage: `url(/VR.jpg)` }}
                  // style={{ backgroundImage: `url(${VR})` }}
                ></div>
                <h3>Vrunda Radadiya</h3>
                <p>Developer</p>
              </div>
              <div className={styles["member_card"]}>
                <div
                  className={styles["member_photo"]}
                  style={{ backgroundImage: `url(/MV.jpg)` }}
                  // style={{ backgroundImage: `url(${MV})` }}
                ></div>
                <h3>Meghana Vasava</h3>
                <p>Developer</p>
              </div>
              <div className={styles["member_card"]}>
                <div
                  className={styles["member_photo"]}
                  style={{ backgroundImage: `url(/KP.jpg)` }}
                  // style={{ backgroundImage: `url(${kp})` }}
                ></div>
                <h3>Khushi Patel</h3>
                <p>Developer</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default AboutUs;
