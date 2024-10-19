import React, { useEffect ,useState} from "react";

import {BrowserRouter,Router ,Route, Routes} from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
// import "./Components/chatComponents/styles.scss"

import Chat from "./Components/Chat"

// import Home from "./Components/chatComponents/Home"
import StreakCalendar from "./Components/StreakCalendar";
import MyActivity from "./Components/MyActivity";
import Footer from "./Components/Footer";
import UserProfile from "./Components/UserProfile";

import LeaderBoard from "./Components/LeaderBoard";

import Registration from "./Components/Registration";
import Login from "./Components/Login";


// import { UserList } from './Components/UserList';

//import { createOrGetChat } from './Components/ChatUtils';

function App() {
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );

  // return (
  //   <div>
  //     <MyComponent></MyComponent>
  //   </div>
  // );

  const userId = "user_1729172812032"; // Example user ID, replace as needed
 
  const mockUser = { id: userId, username: 'aashi' }; // Replace with actual user data
  // const [chatId, setChatId] = useState(null); // For storing the active chat ID
  // const [selectedUser, setSelectedUser] = useState(null); // For storing the selected user
  // const currentUser = { id: userId, username: "ExampleUser" }; // Mock current user

  // // Function to handle user selection and create/get a chat session
  // const handleUserSelect = (user) => {
  //   createOrGetChat(currentUser.id, user.id).then((chatId) => {
  //     setChatId(chatId); // Set the chat ID for the session
  //     setSelectedUser(user); // Set the selected user
  //   });
  // };


  //  return (
  //    <div>
  //    <MyActivity userId={userId}></MyActivity>
  //  </div>
  //  );

  //return (
  //<div>
  //<UserProfile userId={userId}></UserProfile>






 
  // return (
  //   <div>
  //   <LeaderBoard />

  //   </div>
  // );
  

  
  // return (
  //   <div>
  //     <Registration></Registration>
      
  //   <Login userId={userId}></Login>

  //   </div>
  // );
  return (
    <div>
      {/* Uncomment and modify these returns based on your need */}
      {/* <MyActivity userId={userId}></MyActivity> */}

      {/* <UserProfile userId={userId}></UserProfile> */}

      {/* Render UserList if no chatId is selected, else show the Chat component */}
      {/* {!chatId ? (
        <UserList onUserSelect={handleUserSelect} />
      ) : (
        <Chat chatId={chatId} currentUser={currentUser} />
      )} */}
      {/* <Home/> */}
      {/* <Chat></Chat> */}

      {/* <Login></Login> */}
    
    <BrowserRouter>
    
    <Routes>
      <Route path="/Login" element={<Login/>}></Route>
      <Route path="/Registration" element={<Registration userId={ userId}/>}></Route>
      <Route path="/MyActivity" element={<MyActivity userId={userId} />} />
      <Route path="/Chat" element={<Chat userId={userId} />} />
    
    
    </Routes>
    </BrowserRouter> 
    </div>
 
  );

  
}

export default App;





