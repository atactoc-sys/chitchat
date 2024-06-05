import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../../firebase";
import { AuthContext } from "../../context/AuthContext";
import { Typography } from "@mui/material";
import { ChatContext } from "../../context/ChatContext";
import Divider from "@mui/material/Divider";
import "./Chats.css";

function Chats() {
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  /* The `useEffect` hook in the provided code snippet is responsible for fetching chat data for the
  current user from a Firestore database and updating the component state with this data. Here's a
  breakdown of what it does: */
  useEffect(() => {
    /**
     * The function `getChats` retrieves chat data for the current user from a Firestore database and
     * sets it in the component state.
     * @returns The `getChats` function returns the `unsubscribe` function, which can be used to stop
     * listening to changes in the database.
     */
    const getChats = () => {
      const unsubscribe = onSnapshot(
        doc(db, "userChats", currentUser.uid),
        (snapshot) => {
          const chatData = snapshot.data();
          if (chatData) {
            setChats(Object.entries(chatData));
          }
        }
      );
      return unsubscribe;
    };

    if (currentUser?.uid) {
      getChats();
    }
  }, [currentUser?.uid]);

  /**
   * The handleSelect function dispatches an action to change the user in a React application.
   */
  const handleSelect = (user) => {
    dispatch({ type: "CHANGE_USER", payload: user });
  };

  return (
    <div className="chats">
      {chats
        // /* The code snippet `.sort((a, b) => b[1].date - a[1].date).map(([chatId, chat])` is performing
        // two operations on the `chats` array: */
        .sort((a, b) => b[1].date - a[1].date)
        .map(([chatId, chat]) => (
          <>
            <div
              className="userChat"
              key={chatId}
              onClick={() => handleSelect(chat.userInfo)}
            >
              <img src={chat.userInfo.photoURL} alt="User Avatar" />
              <div className="userChatInfo">
                <Typography variant="h4">
                  {chat.userInfo.displayName}
                </Typography>
                <Typography>{chat.lastMessage?.text}</Typography>
              </div>
            </div>
            <Divider variant="middle" sx={{ borderColor: "#962E2A" }} />
          </>
        ))}
    </div>
  );
}

export default Chats;
