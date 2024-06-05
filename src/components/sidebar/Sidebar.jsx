import React from "react";
import "./Sidebar.css";
import Search from "./../search/Search.jsx";
import Chats from "./../chats/Chats.jsx";
function Sidebar() {
  return (
    <div className="sidebar">
      <Search />
      <Chats />
    </div>
  );
}

export default Sidebar;
