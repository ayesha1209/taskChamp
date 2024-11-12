import React, { useState, useRef, useEffect } from "react";
import { createUserInFirebase } from "../FirebaseOperations";
import { useNavigate } from "react-router-dom";
import { User } from "../models/User";
import styles from "./Registration.module.css";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage();

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
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");
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

      const rotateX = (y / height - 0.5) * 10; // Rotate based on vertical mouse movement
      const rotateY = (x / width - 0.5) * -10; // Rotate based on horizontal mouse movement

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImageUrl(reader.result);
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Create new user object
    const formattedBirthdate = formatDate(birthdate);
    const newUser = new User(
      null, // userId will be generated in Firebase
      username,
      password,
      formattedBirthdate,
      country,
      email
    );

    if (profileImage) {
      const storageRef = ref(storage, `userProfiles/${Date.now()}_${username}`);
      uploadBytes(storageRef, profileImage).then(() => {
        getDownloadURL(storageRef).then((url) => {
          newUser.imageUrl = url;
          createUserInFirebase(newUser)
            .then((generatedUserId) => {
              setUserId(generatedUserId);
              localStorage.setItem("userId", generatedUserId);
              navigate("/MyActivity"); // Redirect to MyActivity page
            })
            .catch((error) => {
              setError("Error saving user data. Please try again.");
            });
        });
      });
    } else {
      createUserInFirebase(newUser)
        .then((generatedUserId) => {
          setUserId(generatedUserId);
          localStorage.setItem("userId", generatedUserId);
          navigate("/MyActivity"); // Redirect to MyActivity page
        })
        .catch((error) => {
          setError("Error saving user data. Please try again.");
        });
    }
  };

  const handleLoginRedirect = () => {
    navigate("/Login");
  };

  return (
    <div ref={glowRef} className={`${styles.reg_outer}`}>
      <div
        className={`flex min-h-screen items-center justify-center bg-[#f5f5f5f] px-20 py-7 ${styles.reg_inner} `}
      >
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

        <div ref={cardRef} className={styles.reg_container}>
          <div className={`${styles.blurBackground} w-[100%] md:w-[100%]`}>
            <div className={styles.blur_inner}>
              <h2 className="text-3xl font-bold text-center text-[#f5f5f5] mb-6">
                Create Account
              </h2>

              {/* Image Preview */}
              {profileImageUrl && (
                <div className="mb-4 flex justify-center">
                  <img
                    src={profileImageUrl}
                    alt="Profile Preview"
                    className={styles.reg_image}
                  />
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-[#d1c4db] font-medium mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter Username"
                    className={styles.input}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#d1c4db] text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className={styles.input}
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    name="email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#d1c4db] text-sm font-medium mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={styles.input}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      name="password"
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
                        className="w-4 h-4"
                      />
                    </button>
                  </div>
                </div>

                {/* Birthdate Input */}
                <div>
                  <label className="block text-[#d1c4db] text-sm font-medium mb-1">
                    Birthdate
                  </label>
                  <input
                    type="date"
                    className={styles.input}
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                  />
                </div>

                {/* Country Input */}
                <div>
                  <label className="block text-[#d1c4db] text-sm font-medium mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Enter your country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-[#d1c4db] text-sm font-medium mb-1">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    className={styles.input}
                  />
                </div>

                <button type="submit" className={styles.submitButton}>
                  Register
                </button>
                {userId && (
                  <p className="text-center text-gray-600 mt-4">
                    User ID: {userId}
                  </p>
                )}

                {error && (
                  <p className="text-center text-red-500 text-lg mt-4">
                    {error}
                  </p>
                )}
              </form>

              <p className="text-center text-md text-[#d1c4db] mt-4">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={handleLoginRedirect}
                  className="text-[#e09eff] text-md hover:text-[#c880d5]"
                >
                  Login here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
