import React, { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { realDb } from "../firebase";
import styles from "./LeaderBoard.module.css";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'; // Import Recharts components

const LeaderBoard = ({ loggedInUserId }) => {
  const [users, setUsers] = useState([]);

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

          const weeklyData = user.weeklyData || [];

          return {
            userId,
            username: user.username,
            completedTasks,
            score,
            weeklyData // Weekly performance data
          };
        });

        leaderboardData.sort((a, b) => b.score - a.score || b.completedTasks - a.completedTasks);

        setUsers(leaderboardData);
      }
    };

    fetchUsersData();
  }, [loggedInUserId]);

  const getReward = (index) => {
    switch (index) {
      case 0:
        return <span className={`${styles.Reward} ${styles.Gold}`}>🏆 Gold Medal</span>;
      case 1:
        return <span className={`${styles.Reward} ${styles.Silver}`}>🥈 Silver Medal</span>;
      case 2:
        return <span className={`${styles.Reward} ${styles.Bronze}`}>🥉 Bronze Medal</span>;
      default:
        return <span className={styles.Reward}>🎖 Participation Badge</span>;
    }
  };

  return (
    <div className={styles.LeaderBoard}>
      <h1>LeaderBoard</h1>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>User ID</th>
            <th>Completed Tasks</th>
            <th>Score</th>
            <th>Reward</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.userId}>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.userId}</td>
              <td>{user.completedTasks}</td>
              <td>{user.score}</td>
              <td>{getReward(index)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Display the performance graph */}
      <h2>Weekly Performance Comparison (Top 7 Users)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={users.slice(0, 7)} // Show only the top 7 users
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="username" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="score" stroke="#8884d8" />
          <Line type="monotone" dataKey="completedTasks" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeaderBoard;
