import React, { useState } from "react";
import { realDb } from "../firebase";
import { ref, get, child } from "firebase/database";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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
    <div className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
      <div className="flex flex-col md:flex-row w-full max-w-7xl shadow-lg rounded-2xl overflow-hidden bg-white">

        {/* Left Section */}
        <div className="flex-1 bg-[#f4f9ff] flex flex-col items-center justify-center p-8">
          <h2 className="text-4xl font-semibold text-[#333333] mb-4">Welcome back !!</h2>
          <p className="text-lg text-[#5a5a5a] text-center mb-6">
            Ready to conquer your day?
          </p>
          <img
            src="/loginimage1.jpeg"
            alt="Animated Graphic"
            className="w-full "
          />
        </div>

        {/* Right Section */}
        <div className="flex-1 p-8 bg-[#fff]">
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
              Login
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-gray-600 text-lg">Username or Email</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d8143]"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                required
              />

              <label className="block text-gray-600 mt-4 text-lg">Password</label>
              <div className="flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d8143]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="ml-2 text-[#6C63FF] hover:text-[#5A52D5]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img
                    src={showPassword ? "/visible.svg" : "/hidden.svg"}
                    alt={showPassword ? "Hide" : "Show"}
                    className="w-6 h-6"
                  />
                </button>
              </div>

              <div className="flex items-center mt-4">
                <input type="checkbox" id="terms" className="mr-2" />
                <label htmlFor="terms" className="text-gray-600">
                  I agree to the{" "}
                  <span className="text-[#6C63FF] underline">terms of service</span> and{" "}
                  <span className="text-[#6C63FF] underline">privacy policy</span>.
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#309a42] text-white py-2 rounded-lg mt-6 hover:bg-[#2b825a] transition"
              >
                Login
              </button>

              {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/Registration")}
                  className="text-[#309a42] underline hover:text-[#2b825a] transition"
                >
                  Register
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
