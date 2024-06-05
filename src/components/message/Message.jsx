import React, { useContext, useEffect, useRef } from "react";
import "./Message.css";
import Typography from "@mui/material/Typography";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

function Message({ message }) {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();
  /* The `useEffect` hook in the `Message` component is used to scroll the message into view with a
  smooth behavior whenever the `message` prop changes. */
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={ref}
      className={`message ${
        message.senderId === currentUser.uid ? "owner" : ""
      }`}
    >
      {/* /* This part of the code is responsible for displaying the user avatar within the message
      component. */}
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt="User Avatar"
        />
      </div>
      <div className="messageContents">
        {/* /* This code is conditionally rendering content based on the presence of `message.text` and
        `message.img`.  */}
        {message.text && <Typography variant="h4">{message.text}</Typography>}
        {message.img && <img src={message.img} alt="Message Content" />}
      </div>
    </div>
  );
}

export default Message;
