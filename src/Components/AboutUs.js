import React, { useState, useEffect, useRef } from "react";
import styles from "./AboutUs.module.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

// Import each image with a unique name
// import kp from "../assets/images/kp.jpg";
// import AP from "../assets/images/AP.jpg";
// import VR from "../assets/images/VR.jpg";
// import MV from "../assets/images/MV.jpg";

const AboutUs = () => {
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
      if (!isMouseOverElement(navbar, 20) && !isMouseOverElement(footer)) {
        Array.from({ length: 3 }).forEach(() =>
          ballsRef.current.push(new Ball(mouse.current))
        );
      }
    }

    function mouseout() {
      mouse.current.x = undefined;
      mouse.current.y = undefined;
    }

    function isMouseOverElement(element, distance) {
      if (!element) return false;

      const rect = element.getBoundingClientRect();
      const mouseX = mouse.current.x;
      const mouseY = mouse.current.y;

      return (
        mouseX >= rect.left - distance &&
        mouseX <= rect.right + distance &&
        mouseY >= rect.top - distance &&
        mouseY <= rect.bottom + distance
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

  return (
    <div className={styles["about_us_container"]}>
      <div ref={navbarRef} className={styles.navbar}>
        <Navbar></Navbar>
      </div>
      <canvas ref={canvasRef} className={styles.canvas} id="canvas" />
      <div className={styles.about_inner}>
        <section className={styles.about_header}>
          <h1>What is Tasky ?!</h1>
          <h1>What is Tasky ?!</h1>
          <p>Discover who we are and what we stand for !</p>
        </section>
        <div className={styles.miss_viss}>
          <div>
            <img src="mission_vission.svg"></img>
          </div>
          <p>Let's dive into our mission and vision!</p>
        </div>
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
        <div className={styles.studentContribution}>
          <h3>Student Contributions</h3>
          <div className={styles.centeredImage}>
            <img src="/student_contr.svg"></img>
          </div>
          <ul>
            <li>
              Khushi is working on MyActivity, Registration, and User Profile.
            </li>
            <li>
              Vrunda is focused on the Leaderboard and contributing to Login.
            </li>
            <li>Ayesha is handling the Feed/Post and Chat features.</li>
            <li>
              Meghana is responsible for the Dashboard and the About Us page.
            </li>
          </ul>
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
        <section className={styles.techUsed}>
          <h3>Tasky Application Technology Stack</h3>
          <div>
            <img src="tech_app.svg"></img>
          </div>
          <p>
            The combination of React, Tailwind CSS, Firebase, Firestore, Node
            modules, and GitHub has enabled us to create Tasky as a modern and
            efficient task management application. Each technology plays a
            crucial role in ensuring that the application is user-friendly,
            scalable, and maintainable. We are excited to continue developing
            Tasky and enhancing its features in the future.
          </p>
        </section>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default AboutUs;
