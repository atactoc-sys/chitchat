import React, { useContext, useState } from "react";
import "./Input.css";
import IconButton from "@mui/material/IconButton";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import { v4 as uuid } from "uuid";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { storage, db } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  arrayUnion,
  doc,
  updateDoc,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Zoom from "@mui/material/Zoom";
import Tooltip from "@mui/material/Tooltip";

function Input() {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  /**
   * The function `handleSend` handles sending messages with optional images in a chat application
   * using Firebase services.
   */
  const handleSend = async () => {
    /* This block of code is handling the scenario where an image is selected by the user to be sent
    along with the message in a chat application. Here's a breakdown of what it does: */
    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.error("Upload failed", error);
        },
        /* This async function is handling the process of uploading an image to Firebase storage and
        then updating the chat messages with the image URL. Here's a breakdown of what it does: */
        async () => {
          /* This block of code is handling the scenario where an image is selected by the user to be
          sent along with a message in a chat application. Here's a breakdown of what it does: */
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateDoc(doc(db, "chats", data.chatId), {
            messages: arrayUnion({
              id: uuid(),
              text,
              senderId: currentUser.uid,
              date: Timestamp.now(),
              img: downloadURL,
            }),
          });
          setAlertOpen(true);
        }
      );
    } else {
      /* The code `await updateDoc(doc(db, "chats", data.chatId), { messages: arrayUnion({ id: uuid(),
      text, senderId: currentUser.uid, date: Timestamp.now(), }), });` is updating a document in the
      Firestore database. Here's a breakdown of what it is doing: */
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    /* The code `await updateDoc(doc(db, "userChats", currentUser.uid), { [data.chatId +
    ".lastMessage"]: { text, }, [data.chatId + ".date"]: serverTimestamp(), });` is updating a
    specific document in the Firestore database under the collection "userChats" for the current
    user's ID. */
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    /* The code `await updateDoc(doc(db, "userChats", data.user.uid), { [data.chatId + ".lastMessage"]:
    { text, }, [data.chatId + ".date"]: serverTimestamp(), });` is updating a specific document in
    the Firestore database under the collection "userChats" for a specific user's ID. */
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Write message"
        onChange={(e) => setText(e.target.value)}
        value={text}
        style={{ marginLeft: "15px" }}
      />
      <div className="sendseatures">
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <IconButton component="span">
            <Tooltip TransitionComponent={Zoom} title="Select an Image" arrow>
              <AttachFileIcon style={{ color: "#fb6542", fontSize: "20px" }} />
            </Tooltip>
          </IconButton>
        </label>
        <Tooltip TransitionComponent={Zoom} title="Click to Send" arrow>
          <Button
            variant="contained"
            sx={{ "&:hover": { boxShadow: "none" } }}
            onClick={handleSend}
          >
            <SendIcon />
          </Button>
        </Tooltip>
      </div>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert onClose={() => setAlertOpen(false)} severity="success">
          Image uploaded successfully!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Input;
