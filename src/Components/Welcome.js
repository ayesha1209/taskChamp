import React, { useState, useEffect } from 'react';
import styles from './Welcome.module.css';  // Import the CSS file for styling
import { Link } from 'react-router-dom';
import Image2 from '../assets/images/Image2.png';


const Welcome = () => {
  
  return (
    <div className={styles.welcomeContainer}>
      <div className={styles.textContainer}>
        <h1 className={styles.title}>
          Welcome to <span className={styles.taskChamp}>TaskChamp</span>!
        </h1>
        <p className={styles.description}>
          Your ultimate sidekick for slaying tasks and leveling up productivity! 🚀
        </p>
        <br></br>
        <br></br>
        <div className={styles.callToAction}>
          Ready to start conquering your tasks with us? Click below!
        </div>
        
        <Link to="/home">
          <button className={styles.ctaButton}>Let's Get Started 🚀</button>
        </Link>
      </div>

      <div className={styles.imageContainer}>
        <img src={Image2} alt="TaskChamp" className={styles.welcomeImage} />
      </div>
    </div>
  );
};

export default Welcome;
