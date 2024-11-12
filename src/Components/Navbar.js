import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <div className={styles.navbar_outer}>
      <div className={styles.navbar}>
        <nav>
          <ul>
            <li>
              <Link to="/dashboard" className={styles.nav_link}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/MyActivity" className={styles.nav_link}>
                My Activity
              </Link>
            </li>
            <li>
              <Link to="/LeaderBoard" className={styles.nav_link}>
                Leadership Board
              </Link>
            </li>

            <li>
              <Link to="/Chat" className={styles.nav_link}>
                Chat
              </Link>
            </li>
            <li>
              <Link to="/Feed" className={styles.nav_link}>
                Feed
              </Link>
            </li>
            <li>
              <Link to="/Registration" className={styles.nav_link}>
                Register
              </Link>
            </li>
            <li>
              <Link to="/Login" className={styles.nav_link}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/UserProfile" className={styles.nav_link}>
                User Profile
              </Link>
            </li>
            <li>
              <Link to="/AboutUs" className={styles.nav_link}>
                About Us
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
