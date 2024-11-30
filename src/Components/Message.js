import React from "react";
import { Search as SearchIcon, Send, Paperclip } from "lucide-react";
import styles from "./Message.module.css";

const Message = ({ message, isSentByCurrentUser }) => {
  return (
    <div
      className={`flex ${
        isSentByCurrentUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[70%] rounded-lg px-4 ${
          isSentByCurrentUser ? styles.sentBubble : styles.receivedBubble
        }`}
      >
        {message.text}
      </div>
    </div>
  );
};

export default Message;
