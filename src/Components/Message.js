import React from "react";
import { Search as SearchIcon, Send, Paperclip } from "lucide-react";

const Message = ({ message, isSentByCurrentUser }) => {
  return (
    <div className={`flex ${isSentByCurrentUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isSentByCurrentUser
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
};

export default Message;
