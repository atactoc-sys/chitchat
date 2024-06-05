import React from "react";
import "./Home.css";
import Sidebar from "./../sidebar/Sidebar.jsx";
import Chat from "../chat/Chat.jsx";

function Home() {
  return (
    /* This code snippet is defining the structure of the Home component in a React application. It
    creates a parent `<div>` element with a class name of "home" and contains a child `<div>`
    element with a class name of "container". Inside the "container" div, it renders the Sidebar
    component and the Chat component. This structure represents the layout of the Home component
    where the Sidebar and Chat components are displayed within a container. */
    <div className="home">
      <div className="container">
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
}

export default Home;
