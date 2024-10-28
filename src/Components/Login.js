import React, { useState } from "react";
import { realDb } from "../firebase";
import { useNavigate } from "react-router-dom";
import { ref, get, child } from "firebase/database";
import styles from "./Login.module.css";

const Login = () => {
  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const dbRef = ref(realDb);

    get(child(dbRef, "users"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const users = snapshot.val();
          // Assuming users is an object where each user is stored under a unique key
          const userKey = Object.keys(users).find((key) => {
            const user = users[key];
            return (
              user.username === usernameOrEmail ||
              user.email === usernameOrEmail
            );
          });

          if (userKey) {
            const user = users[userKey];
            if (user.password === password) {
              console.log("Login successful!");

              // Storing user ID in local storage
              localStorage.setItem("userId", userKey); // Store the user's key (or change to user.id if it exists)

              // Redirect to MyActivity page using navigate from react-router-dom
              navigate("/MyActivity");
            } else {
              setError("Incorrect password.");
            }
          } else {
            setError("User not found.");
          }
        } else {
          setError("No users found in the database.");
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
        setError("Login failed. Please try again.");
      });
  };

  const handleRegistrationRedirect = () => {
    navigate("/Registration");
  };

  return (
  <div className={styles.bg}>
   <div className={styles.login_container}>
     {/* Left - Form Section */}
     <div className={styles.form_section}>
       <h2 className={styles.login_header}>Welcome Back</h2>
       <form className={styles.login_form} onSubmit={handleSubmit}>
         {/* Username or Email Input */}
         <label className={styles.login_label}>Username or Email</label>
         <input
           type="text"
           className={styles.login_input}
           value={usernameOrEmail}
           onChange={(e) => setUsernameOrEmail(e.target.value)}
           required
         />

         {/* Password Input */}
         <label className={styles.login_label}>Password</label>
         <div style={{ display: "flex" }}>
           <input
             type={showPassword ? "text" : "password"}
             className={styles.login_passwordInput}
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             required
           />
           <button
             type="button"
             className={styles.login_toggleButton}
             onClick={() => setShowPassword(!showPassword)}
           >
             {showPassword ? "Hide" : "Show"}
           </button>
         </div>

         {/* Submit Button */}
         <button type="submit" className={styles.login_submitButton}>
           Log In
         </button>

         {/* Error Message */}
         {error && <p className={styles.login_error}>{error}</p>}
       </form>

       {/* Registration Link */}
       <div className={styles.registration_link}>
         Don't have an account?
         <button
           onClick={handleRegistrationRedirect}
           className={styles.link}
         >
           Sign up
         </button>
       </div>
     </div>

     {/* Right - Image Section */}
     <div className={styles.image_section}>
       <img src="your-image-path-here.jpg" alt="Illustration" />
     </div>
   </div>
</div>

  );
};

export default Login;