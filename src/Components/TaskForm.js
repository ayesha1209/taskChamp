import React, { useState, useRef, useEffect } from "react";
import { createTaskWithPriority } from "../Services/TaskServices";
import styles from "./TaskForm.module.css";
import { User } from "../models/User";

const TaskForm = ({ reloadWithTask, setDateTask }) => {
  const [taskname, setTaskname] = useState("");
  const [date, setDate] = useState("");
  const [level, setLevel] = useState("medium");
  const [is_done, setIsDone] = useState(false);
  const userId = localStorage.getItem("userId");
  const cardRef = useRef(null);

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDate = new Date(date).toLocaleDateString("en-GB");
    await createTaskWithPriority(
      userId,
      formattedDate,
      taskname,
      level,
      is_done
    );
    console.log("Done");
    const user = await User.fetch(userId);
    await user.updateStreak(formattedDate);
    localStorage.setItem(
      "selectedDate",
      new Date(date).toLocaleDateString("en-GB")
    );
    setDateTask(new Date(date).toLocaleDateString("en-GB"));
    reloadWithTask();
  };

  return (
    <div className={styles.task_form_div}>
      {/* <img src="tf1.png" className={styles.task_form_image1}></img> */}
      <div className={styles.form_container} ref={cardRef}>
        <form onSubmit={handleSubmit} className={styles.task_form}>
          <input
            type="text"
            value={taskname}
            onChange={(e) => setTaskname(e.target.value)}
            placeholder="Task Name"
            className={styles.task_form_input}
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={styles.task_form_input}
            required
          />
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className={styles.task_form_select}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button type="submit" className={styles.task_form_button}>
            Create Task
          </button>
        </form>
      </div>
      {/* <img src="tf2.png" className={styles.task_form_image2}></img> */}
    </div>
  );
};

export default TaskForm;
