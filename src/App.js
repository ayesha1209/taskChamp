import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import SplashScreen from "./Components/SplashScreen";
import MyActivity from "./Components/MyActivity";
import Footer from "./Components/Footer";
import UserProfile from "./Components/UserProfile";
import LeaderBoard from "./Components/LeaderBoard";
import Registration from "./Components/Registration";
import Login from "./Components/Login";
import AboutUs from "./Components/AboutUs";
import Feed from "./Components/Feed";
import Chat from "./Components/Chat";
import Feature from "./Components/Features";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const userId = "user_1729172812032";

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      {/* SplashScreen with the slide-up effect */}
      {showSplash && <SplashScreen />}

      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/Registration" />} />
          <Route path="/Login" element={<Login />} />
          <Route
            path="/Registration"
            element={<Registration userId={userId} />}
          />
          <Route path="/MyActivity" element={<MyActivity userId={userId} />} />
          <Route
            path="/UserProfile"
            element={<UserProfile userId={userId} />}
          />
          <Route path="/LeaderBoard" element={<LeaderBoard />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/Feed" element={<Feed />} />
          <Route path="/Chat" element={<Chat />} />
          <Route path="/Feature" element={<Feature />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
