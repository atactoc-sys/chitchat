import React, { useContext, useState } from "react";
import "./Search.css";
import {
  Divider,
  IconButton,
  Typography,
  Alert,
  Snackbar,
  Tooltip,
  Zoom,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "./../../firebase";
import { AuthContext } from "../../context/AuthContext";

function Search() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const handleKey = (e) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };

  /**
   * The handleSearchClick function toggles the visibility of an input field and resets username, user
   * data, and error state if the input field is hidden.
   */
  const handleSearchClick = () => {
    setShowInput(!showInput);
    if (!showInput) {
      setUsername("");
      setUser(null);
      setErr(false);
    }
  };

  const handleSearch = async () => {
    /* The code `const q = query(collection(db, "users"), where("displayName", "==", username));` is
    creating a Firestore query to retrieve documents from the "users" collection where the
    "displayName" field is equal to the value stored in the `username` variable. This query is used
    to search for a specific user based on their display name in the Firestore database. */
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setErr(true);
        setUser(null);
        setAlertOpen(true);
      } else {
        querySnapshot.forEach((doc) => {
          setUser(doc.data());
          setErr(false);
          setAlertOpen(false);
        });
      }
    } catch (err) {
      setErr(true);
      setAlertOpen(false);
    }
  };

  /**
   * The function `handleSelect` creates or updates a chat between two users in a chat application.
   * @returns The `handleSelect` function is an asynchronous function that handles the selection of a
   * user for a chat. It first checks if the `user` variable exists, and if not, it returns early. Then
   * it combines the user IDs to create a unique chat ID.
   */
  const handleSelect = async () => {
    if (!user) return;

    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        await updateOrSetDoc(doc(db, "userChats", currentUser.uid), {
          [`${combinedId}.userInfo`]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [`${combinedId}.date`]: serverTimestamp(),
        });

        await updateOrSetDoc(doc(db, "userChats", user.uid), {
          [`${combinedId}.userInfo`]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [`${combinedId}.date`]: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error("Error creating or updating chat:", err);
    }

    setUser(null);
    setUsername("");
  };

  /**
   * The function `updateOrSetDoc` checks if a document exists and updates it if it does, otherwise it
   * sets a new document with the provided data.
   */
  const updateOrSetDoc = async (documentRef, data) => {
    const docSnap = await getDoc(documentRef);
    if (docSnap.exists()) {
      await updateDoc(documentRef, data);
    } else {
      await setDoc(documentRef, data);
    }
  };

  return (
    <div
      className={`searchContainer ${showInput ? "searchContainer-active" : ""}`}
    >
      <div className="search">
        <Typography variant="h4" className={showInput ? "hide" : ""}>
          PEOPLE
        </Typography>
        <IconButton aria-label="search" onClick={handleSearchClick}>
          {showInput ? (
            <Tooltip TransitionComponent={Zoom} title="Close" arrow>
              <ClearIcon />
            </Tooltip>
          ) : (
            <Tooltip TransitionComponent={Zoom} title="Search" arrow>
              <SearchIcon />
            </Tooltip>
          )}
        </IconButton>
        {/* /* The code `{showInput && (...)}` is a conditional rendering in React. It checks the value of
        the `showInput` state variable. If `showInput` is true, it will render the input element
        with the specified attributes inside the parentheses. This means that the input field will
        only be displayed when `showInput` is true, allowing the user to input text for searching
        people. If `showInput` is false, the input field will not be rendered on the screen. */}
        {showInput && (
          <input
            name="people"
            type="text"
            placeholder="Search people"
            onKeyDown={handleKey}
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        )}
      </div>
      {err && (
        <Snackbar open={alertOpen} autoHideDuration={6000}>
          <Alert onClose={() => setAlertOpen(false)} severity="error">
            Something went wrong
          </Alert>
        </Snackbar>
      )}
      {/* /* The code `{user && (...)}` is a conditional rendering in React. It checks if the `user`
      variable exists and is truthy. If `user` is not null or undefined (i.e., it exists and has a
      value), then the code inside the parentheses will be rendered.  */}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt={`${user.displayName}'s avatar`} />
          <div className="userChatInfo">
            <Typography variant="h4">{user.displayName}</Typography>
          </div>
        </div>
      )}
      <Divider />
    </div>
  );
}

export default Search;
