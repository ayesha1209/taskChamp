import React, { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { realDb } from "../firebase";
import Navbar from "./Navbar";
import Footer from "./Footer";
import styles from "./LeaderBoard.module.css";
import { User } from "../models/User";
import { getLoggedInUser } from "../FirebaseOperations";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";

const LeaderBoard = () => {
  const [users, setUsers] = useState([]);
  const [loggedInUserRank, setLoggedInUserRank] = useState(null);
  const [user, setUser] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");
      const fetchedUser = await User.fetch(userId);
      setUser(fetchedUser);

      if (fetchedUser.imageUrl) {
        // Fetch the download URL for the image
        const storage = getStorage();
        const storRef = storageRef(storage, fetchedUser.imageUrl);
        try {
          const url = await getDownloadURL(storRef);
          setImageUrl(url); // Set the image URL state
        } catch (error) {
          console.error("Error fetching image URL:", error);
        }
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchUsersData = async () => {
      const usersRef = ref(realDb, "users/");
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const usersData = snapshot.val();

        const leaderboardData = Object.keys(usersData).map((userId) => {
          const user = usersData[userId];
          const completedTasks = Object.values(user.tasks || {}).filter(
            (task) => task.is_done === true
          ).length;

          const score = Object.values(user.tasks || {}).reduce(
            (total, task) => (task.is_done ? total + task.priority : total),
            0
          );

          return {
            userId, // User ID from Firebase
            username: user.username,
            completedTasks,
            score,
          };
        });

        // Sort leaderboard by score, then by completed tasks
        leaderboardData.sort(
          (a, b) => b.score - a.score || b.completedTasks - a.completedTasks
        );

        // Get the logged-in user information
        const loggedInUser = localStorage.getItem("userId");

        if (loggedInUser) {
          const userRank = leaderboardData.find(
            (user) => user.userId === loggedInUser
          );
          if (userRank) {
            setLoggedInUserRank({
              ...userRank,
              rank: leaderboardData.indexOf(userRank) + 1,
            });
          }
        }

        console.log("Leaderboard Data:", leaderboardData);
        setUsers(leaderboardData);
      }
    };

    fetchUsersData();
  }, []);

  const getReward = (index) => {
    switch (index) {
      case 0:
        return <span className="text-gray-300">🏆 Gold Medal</span>;
      case 1:
        return <span className="text-gray-300">🥈 Silver Medal</span>;
      case 2:
        return <span className="text-gray-300">🥉 Bronze Medal</span>;
      default:
        return <span className="text-gray-300">🎖 participant</span>;
    }
  };

  return (
    <div>
      <div>
        <div className={styles.navbar}>
          <Navbar />
        </div>
        <div
          className={`container mx-auto ${styles.leader_outer}`}
          style={{ paddingLeft: "250px" }}
        >
          <div className={`px-20 py-8 w-[100%] ${styles.leader_inner}`}>
            <h1 className={styles.heading}>LeaderBoard</h1>
            <h1 className={styles.heading}>LeaderBoard</h1>
            {user && (
              <div className={styles.userGreeting}>
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Profile"
                    className={styles.profileImage}
                  />
                )}
                <h2 className={styles.userTask}>{user.username} Here !</h2>
              </div>
            )}
            {/* Logged-in User's Rank */}
            {loggedInUserRank ? (
              <div
                className={`bg-white shadow-lg rounded-lg mb-10 ${styles.rank_outer}`}
              >
                <div className={`p-4 ${styles.rank_inner}`}>
                  <h2 className="text-xl font-bold text-white mb-1">
                    Your Rank : {loggedInUserRank.rank}
                  </h2>
                  <p className="text-gray-400 text-lg font-semibold">
                    Username : {loggedInUserRank.username}
                  </p>
                  <p className="text-gray-400 text-lg font-semibold">
                    Tasks Completed : {loggedInUserRank.completedTasks}
                  </p>
                  <p className="text-gray-400 text-lg font-semibold">
                    Score : {loggedInUserRank.score}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow-lg rounded-lg p-4 mb-12">
                <h2 className="text-xl font-bold mb-2">Your Rank : N/A</h2>
                <p className="text-gray-600 text-sm">
                  Could not find your data in the leaderboard.
                </p>
              </div>
            )}
            {/* Top 3 Contributors */}
            <div className={styles.outerRankBoard}>
              <h3>Top 3 Users</h3>
              <div className={styles.centerImage}>
                <img src="/leader.svg"></img>
                <p>
                  Gold, Silver, Bronze: more than medals, they're your hustle
                  goals!
                </p>
                <p>Push harder, aim higher, and own the leaderboard!</p>
              </div>
              <div className={`grid grid-cols-1 sm:grid-cols-3 gap-10`}>
                {users.slice(0, 3).map((user, index) => (
                  <div
                    key={user.userId}
                    className={`shadow-xl text-sm rounded-2xl flex flex-col mr-4 items-center hover:cursor-pointer  ${
                      index === 0
                        ? "border-t-4 border-[#9793ba]"
                        : index === 1
                        ? "border-t-4 border-[#9793ba]"
                        : "border-t-4 border-[#9793ba]"
                    } ${styles.rank_board_outer}`}
                  >
                    <div className={`${styles.rank_board_inner} p-5`}>
                      <h2 className="text-lg text-white font-bold mb-1">
                        {user.username}
                      </h2>
                      <p className="text-gray-400 font-semibold">
                        Tasks Completed: {user.completedTasks}
                      </p>
                      <p className="text-gray-400 font-semibold">
                        Score: {user.score}
                      </p>
                      <div className="mt-3 font-semibold">
                        {getReward(index)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Leaderboard Table for the rest */}
            <div className={styles.leader_board_outer}>
              <div className={`overflow-y-auto ${styles.leader_board_inner}`}>
                <table className="min-w-full border-gray-400 shadow-md rounded-lg overflow-hidden hover:cursor-pointer">
                  <thead
                    className={`text-md sticky top-0 z-10 font-bold ${styles.table_head}`}
                  >
                    <tr>
                      <th className="px-5 py-5 text-left">Rank</th>
                      <th className="px-5 text-left">Username</th>
                      {/* <th className="px-4 text-left">User ID</th> */}
                      <th className="px-5 text-left">Completed Tasks</th>
                      <th className="px-5 text-left">Score</th>
                      <th className="px-5 text-left">Reward</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr
                        key={user.userId}
                        className={`hover:bg-g hover:cursor-pointer text-sm duration-300 ${
                          user.userId === loggedInUserRank?.userId
                            ? "bg-transparent"
                            : "bg-transparent"
                        } ${styles.leader_table_li}`} // Highlight logged-in user's row
                      >
                        <td className="px-7 py-3 text-gray-300">{index + 1}</td>
                        <td className="py-2 px-5 text-gray-300 hover:scale-105">
                          {user.username}
                        </td>
                        {/* <td className="p-2 text-gray-300">{user.userId}</td> */}
                        <td className="px-16 text-gray-300">
                          {user.completedTasks}
                        </td>
                        <td className="px-6 text-gray-300">{user.score}</td>
                        <td className="py-2 px-4 text-gray-300">
                          {getReward(index)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Display the performance graph */}
            <div className={styles.graphOuter}>
              <h2 className="text-2xl text-center text-white font-bold">
                Weekly Performance Comparison (Top 10 Users)
              </h2>
              <div className={styles.centerImageGraph}>
                <img src="/graph.svg"></img>
                <p>
                  Check out the top 10 users' vibes! Charts show their scores &
                  tasks smashed.
                </p>
                <p>Insights = user energy + productivity decoded!</p>
              </div>
              <ResponsiveContainer
                width="100%"
                height={400}
                className="mt-4 mb-3 pr-5 transition-opacity duration-500 opacity-100 hover:opacity-80 text-black"
              >
                <LineChart
                  data={users.slice(0, 10)}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="username" className="text-black text-sm" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#8B5DFF"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="completedTasks"
                    stroke="#9793ba"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <Footer></Footer>
      </div>
    </div>
  );
};

export default LeaderBoard;
