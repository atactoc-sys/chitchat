import React, { useContext, useEffect, useState } from "react";
import "./Messages.css";
import Message from "./../message/Message";
import { ChatContext } from "../../context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

function Messages() {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  /* The `useEffect` hook in the provided code snippet is responsible for setting up a subscription to
 listen for changes in the messages of a specific chat room. Here's a breakdown of what it does: */
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  console.log(messages);

  return (
    <div className="messeges">
      {/* /* The code `{messages.map((m) => (<Message message={m} key={m.id} />))}` is responsible for
      rendering a list of `Message` components based on the `messages` array. Here's a breakdown of
      what it does:  */}
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
}

export default Messages;
