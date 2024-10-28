import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Firebase configuration import
import { createUserInFirebase } from "../FirebaseOperations"; // Saving the user in the database
import { useNavigate } from "react-router-dom";
import { User } from "../models/User";
import styles from "./Registration.module.css";

const Registration = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Clear error before submitting

    // Firebase authentication
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User created in Firebase Auth:", user);

        const formattedBirthdate = formatDate(birthdate);

        // Creating new user instance
        const newUser = new User(
          user.uid, // Use Firebase user UID
          username,
          password,
          formattedBirthdate,
          country,
          email
        );

        // Store user details in Firebase Realtime Database or Firestore
        createUserInFirebase(newUser)
          .then((generatedUserId) => {
            setUserId(generatedUserId);
            console.log(
              "User registered successfully with userId:",
              generatedUserId
            );

            // Store the userId in localStorage
            localStorage.setItem("userId", generatedUserId);

            // Navigate to Login page after successful registration
            navigate("/Login");
          })
          .catch((error) => {
            console.error("Error saving user to database:", error);
            setError("Error saving user data. Please try again.");
          });
      })
      .catch((error) => {
        console.error("Error registering user in Firebase Auth:", error);
        setError(
          "Error creating account. Please check your details and try again."
        );
      });
  };

  const handleLoginRedirect = () => {
    navigate("/Login");
  };

  return (
    <div>
      <br />
      <br />
      <div className={styles.reg_container}>
        <h2 className={styles.reg_header}>Register</h2>
        <form className={styles.reg_form} onSubmit={handleSubmit}>
          <div>
            <label className={styles.reg_label}>Username :</label>
            <input
              type="text"
              name="username"
              className={styles.reg_input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={styles.reg_label}>Email :</label>
            <input
              type="email"
              name="email"
              className={styles.reg_input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={styles.reg_label}>Password :</label>
            <div style={{ display: "flex" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={styles.reg_passwordInput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.reg_toggleButton}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div>
            <label className={styles.reg_label}>Birthdate :</label>
            <input
              type="date"
              name="birthdate"
              className={styles.reg_dateInput}
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={styles.reg_label}>Country :</label>
            <input
              type="text"
              name="country"
              className={styles.reg_input}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.reg_submitButton}>
            Register
          </button>
          {error && <p className={styles.reg_error}>{error}</p>}
        </form>

        {userId && <p>User ID: {userId}</p>}
        <div className={styles.login_link}>
          <p>
            Already have an account?{" "}
            <button
              type="button"
              onClick={handleLoginRedirect}
              className={styles.link_button}
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;
