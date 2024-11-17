import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <div className={styles.navbar_outer}>
      <div className={styles.navbar}>
        <nav>
          <ul>
            <li>
              <Link to="/Feature" className={styles.nav_link}>
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
                Leader Board
              </Link>
            </li>

            <li>
              <Link to="/Chat" className={styles.nav_link}>
                Conversations
              </Link>
            </li>
            <li>
              <Link to="/Feed" className={styles.nav_link}>
                Community Hub
              </Link>
            </li>
            <li>
              <Link to="/Registration" className={styles.nav_link}>
                Add Account
              </Link>
            </li>
            <li>
              <Link to="/Login" className={styles.nav_link}>
                Switch User
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
