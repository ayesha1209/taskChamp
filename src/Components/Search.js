import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { realDb } from "../firebase";
import { Search as SearchIcon, Send, Paperclip } from "lucide-react";

const Search = ({ onSelectUser }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const usersRef = ref(realDb, "users");
    onValue(usersRef, (snapshot) => {
      const allUsers = [];
      snapshot.forEach((childSnapshot) => {
        const userData = childSnapshot.val();
        const uid = childSnapshot.key; // Get the UID from the key
        allUsers.push({ uid, ...userData }); // Spread the rest of the user data
      });
      setUsers(allUsers);
      console.log(allUsers); // Check users' structure
    });
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.username &&
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B7EBD] h-4 w-4" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 placeholder-[#9B7EBD] text-[#3B1E54] font-semibold pr-4 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>
      {searchTerm && (
        <ul className="absolute w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {filteredUsers.map((user) => (
            <li
              key={user.uid}
              onClick={() => {
                onSelectUser(user);
                setSearchTerm("");
              }}
              className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
            >
              {user.username}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
