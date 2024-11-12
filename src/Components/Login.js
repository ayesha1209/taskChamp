import React, { useState, useRef, useEffect } from "react";
import { realDb } from "../firebase";
import styles from "./Login.module.css";
import { ref, get, child } from "firebase/database";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const glow = glowRef.current;
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    glow.addEventListener("mousemove", handleMouseMove);

    return () => {
      glow.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const card = cardRef.current;

    const handleMouseMove = (e) => {
      const { width, height, left, top } = card.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;

      const rotateX = (y / height - 0.5) * 10;
      const rotateY = (x / width - 0.5) * -10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
    };

    if (card) {
      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (card) {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const dbRef = ref(realDb);
    get(child(dbRef, "users"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const users = snapshot.val();
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
              localStorage.setItem("userId", userKey);
              navigate("/MyActivity");
            } else {
              setError("Incorrect password, Enter password properly.");
            }
          } else {
            setError("User not found.");
          }
        } else {
          setError("No users found in the database.");
        }
      })
      .catch(() => {
        setError("Login failed. Please try again.");
      });
  };

  return (
    <div
      ref={glowRef}
      className={`${styles.minHScreen} flex items-center justify-center relative`}
    >
      <div className={styles.log_inner}>
        <div
          className="glowingEffect"
          style={{
            position: "absolute",
            left: `${cursorPosition.x}px`,
            top: `${cursorPosition.y}px`,
            width: "1px",
            height: "1px",
            backgroundColor: "#6a3ba3",
            borderRadius: "50%",
            boxShadow: "0 0 200px 200px #481e7cf5",
            pointerEvents: "none",
            transform: "scale(1)",
            transition: "all 0s ease-in-out",
            opacity: 0.3,
            animation: "pulse 0s infinite",
          }}
        ></div>
        <div
          ref={cardRef}
          className={`${styles.cardContainer} flex flex-col md:flex-row w-[40%] max-w-6xl relative`}
        >
          <div className={`${styles.rightSection} flex-1`}>
            <div className="w-full max-w-md mx-auto">
              <h2
                className={`${styles.loginTitle} text-4xl font-bold text-center mb-8 mt-6`}
              >
                Login
              </h2>
              <form onSubmit={handleSubmit} className="space-y-1">
                <label className={styles.label}>Username or Email</label>
                <input
                  type="text"
                  placeholder="Enter your Username or Email"
                  className={`${styles.input} w-full`}
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  required
                />
                <br></br>
                <br></br>
                <label className={`${styles.label}`}>Password</label>
                <div className="flex items-center relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your Password"
                    className={`${styles.input} w-full`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-blue-500"
                  >
                    <img
                      src={showPassword ? "/visible.svg" : "/hidden.svg"}
                      alt={showPassword ? "Hide" : "Show"}
                      className="w-5 h-5"
                    />
                  </button>
                </div>
                <div className="flex items-center mt-4 mb-4">
                  <input type="checkbox" id="terms" className="mr-2 mt-2" />
                  <label
                    htmlFor="terms"
                    className={`${styles.textGray} mb-2.5 mt-4`}
                  >
                    I agree to the{" "}
                    <span className={styles.link}>terms of service</span> and{" "}
                    <span className={styles.link}>privacy policy</span>.
                  </label>
                </div>
                <button type="submit" className={`${styles.submitButton} mt-4`}>
                  Login
                </button>
                {error && (
                  <p className={`${styles.errorMessage} text-center mt-4`}>
                    {error}
                  </p>
                )}
              </form>
              <div className="text-center mt-6">
                <p className={`${styles.textGray} text-md`}>
                  Don't have an account?{" "}
                  <button
                    onClick={() => navigate("/Registration")}
                    className={styles.registerLink}
                  >
                    Register
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
